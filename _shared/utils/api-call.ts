import { getToken, getRefreshToken, saveTokens } from "@/_shared/utils/token-manager";
import {
  ApiError,
  isApiError,
  type ApiValidationError,
  type HttpMethod,
} from "@/_shared/types/api-error";
import { API_BASE_URL } from "@/_shared/config/environment";
import { log } from "../logger/logger";

type SessionExpiredHandler = (sessionError: ApiError) => void | Promise<void>;

const REFRESH_ENDPOINT = "/auth/refresh";

let refreshPromise: Promise<boolean> | null = null;
let sessionExpiredHandler: SessionExpiredHandler | null = null;

export function setSessionExpiredHandler(handler: SessionExpiredHandler | null) {
  sessionExpiredHandler = handler;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getValidationErrors(value: unknown): ApiValidationError[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const errors = value.filter(
    (error): error is ApiValidationError =>
      isRecord(error) && typeof error.field === "string" && typeof error.message === "string",
  );

  return errors.length > 0 ? errors : undefined;
}

function createInvalidResponseError(endpoint: string, method: HttpMethod, status: number | null) {
  return new ApiError({
    endpoint,
    method,
    status,
    code: "INVALID_RESPONSE",
    message: "The server returned an invalid response.",
  });
}

async function parseJsonResponse(response: Response, endpoint: string, method: HttpMethod) {
  let responseText: string;

  try {
    responseText = await response.text();
  } catch {
    throw createInvalidResponseError(endpoint, method, response.status);
  }

  if (!responseText) {
    throw createInvalidResponseError(endpoint, method, response.status);
  }

  try {
    return JSON.parse(responseText) as unknown;
  } catch {
    throw createInvalidResponseError(endpoint, method, response.status);
  }
}

function createHttpError(
  response: Response,
  responseData: unknown,
  endpoint: string,
  method: HttpMethod,
) {
  const errorData = isRecord(responseData) ? responseData : {};
  const code = typeof errorData.code === "string" ? errorData.code : "HTTP_ERROR";
  const message =
    typeof errorData.message === "string" && errorData.message
      ? errorData.message
      : response.statusText || "The request failed.";

  return new ApiError({
    endpoint,
    method,
    status: response.status,
    code,
    message,
    errors: getValidationErrors(errorData.errors),
  });
}

async function fetchResponse(
  url: string,
  config: RequestInit,
  endpoint: string,
  method: HttpMethod,
) {
  try {
    return await fetch(url, config);
  } catch {
    throw new ApiError({
      endpoint,
      method,
      status: null,
      code: "NETWORK_ERROR",
      message: "Unable to connect to the server. Check your connection and try again.",
    });
  }
}

async function refreshTokens(): Promise<boolean> {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    log.warn("api-call | Token refresh failed: no refresh token in cache");
    return false;
  }

  const res = await fetchResponse(
    `${API_BASE_URL}${REFRESH_ENDPOINT}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    },
    REFRESH_ENDPOINT,
    "POST",
  );

  const resData = await parseJsonResponse(res, REFRESH_ENDPOINT, "POST");

  if (!res.ok) {
    const refreshError = createHttpError(res, resData, REFRESH_ENDPOINT, "POST");
    const refreshTokenRejected =
      res.status === 401 &&
      (refreshError.code === "REFRESH_TOKEN_REQUIRED" ||
        refreshError.code === "REFRESH_TOKEN_INVALID");

    if (refreshTokenRejected) {
      log.error("api-call | Token refresh rejected:", refreshError);
      return false;
    }

    throw refreshError;
  }

  if (
    !isRecord(resData) ||
    typeof resData.accessToken !== "string" ||
    typeof resData.refreshToken !== "string"
  ) {
    throw createInvalidResponseError(REFRESH_ENDPOINT, "POST", res.status);
  }

  await saveTokens(resData.accessToken, resData.refreshToken);
  log.info("api-call | Token refresh successful.");
  return true;
}

async function refreshTokensOnce(): Promise<boolean> {
  const pending = refreshPromise ?? (refreshPromise = refreshTokens());

  try {
    return await pending;
  } finally {
    if (refreshPromise === pending) {
      refreshPromise = null;
    }
  }
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
    const refreshSucceeded = await refreshTokensOnce();

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
