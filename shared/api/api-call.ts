import { getToken } from "@/shared/storage/token-manager";
import { ApiError, isApiError, type HttpMethod } from "@/shared/api/api-error";
import { API_BASE_URL } from "@/shared/config/environment";
import { log } from "../logging/logger";
import {
  fetchResponse,
  parseJsonResponse,
  createHttpError,
  isRecord,
} from "@/shared/api/api-helpers";
import { performRefreshTokens } from "@/shared/auth/token-refresh";

type SessionExpiredHandler = (sessionError: ApiError) => void | Promise<void>;

let sessionExpiredHandler: SessionExpiredHandler | null = null;

export function setSessionExpiredHandler(handler: SessionExpiredHandler | null) {
  sessionExpiredHandler = handler;
}

export async function apiCall<T = unknown>(
  endpoint: string,
  method: HttpMethod,
  options: RequestInit = {},
  isRetry = false,
): Promise<T> {
  try {
    return await executeApiCall<T>(endpoint, method, options, isRetry);
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    const apiError = new ApiError({
      endpoint,
      method,
      status: null,
      code: "CLIENT_ERROR",
      message: "Unable to complete the request.",
    });

    log.error("api-call | Unexpected client error:", error);
    throw apiError;
  }
}

async function executeApiCall<T>(
  endpoint: string,
  method: HttpMethod,
  options: RequestInit,
  isRetry: boolean,
): Promise<T> {
  const token = await getToken();
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    method,
    headers,
  };

  // First attempt
  const response = await fetchResponse(url, config, endpoint, method);
  const parsedResponse = await parseJsonResponse(response, endpoint, method);

  // Attempt token refresh on 401, but only once
  if (
    response.status === 401 &&
    isRecord(parsedResponse) &&
    parsedResponse.code === "ACCESS_TOKEN_EXPIRED" &&
    !isRetry
  ) {
    log.info("api-call | Access token expired, checking session...");

    const currentToken = await getToken();
    const sessionError = new ApiError({
      endpoint,
      method,
      status: 401,
      message: "Session expired",
      code: "SESSION_EXPIRED",
    });

    const handleSessionExpired = async () => {
      log.warn("api-call | Session expired, signing out...");

      try {
        await sessionExpiredHandler?.(sessionError);
      } finally {
        throw sessionError;
      }
    };

    // This 401 may have arrived after another request already refreshed.
    if (currentToken && currentToken !== token) {
      return apiCall<T>(endpoint, method, options, true);
    }

    if (!currentToken) {
      return handleSessionExpired();
    }

    // All concurrent 401 responses share one refresh request.
    const refreshSucceeded = await performRefreshTokens();

    if (refreshSucceeded) {
      return apiCall<T>(endpoint, method, options, true);
    } else {
      return handleSessionExpired();
    }
  }

  // API error
  if (!response.ok) {
    const apiError = createHttpError(response, parsedResponse, endpoint, method);
    log.error("api-call | API Error:", apiError);
    throw apiError;
  }

  const isBodySensitive = config.body && config.body.toString().includes("password");
  const isParsedResponseSensitive =
    isRecord(parsedResponse) &&
    Object.keys(parsedResponse).some((key) => key.toLowerCase().includes("token"));

  log.info(
    "api-call | API Call:",
    JSON.stringify(
      { endpoint, method, body: isBodySensitive ? "[REDACTED]" : config.body },
      null,
      2,
    ),
  );
  log.info(
    "api-call | Response:",
    JSON.stringify(
      {
        status: response.status,
        body: isParsedResponseSensitive ? "[REDACTED]" : parsedResponse,
      },
      null,
      2,
    ),
  );

  return parsedResponse as T;
}
