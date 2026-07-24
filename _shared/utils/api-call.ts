import { getToken, getRefreshToken, saveTokens } from "@/_shared/utils/token-manager";
import { log } from "../logger/logger";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type SessionExpiredHandler = (sessionError: SessionError) => void | Promise<void>;
export type SessionError = {
  endpoint: string;
  method: HttpMethod;
  status: number;
  success: false;
  message: string;
  code: "SESSION_EXPIRED";
};

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000";

let refreshPromise: Promise<boolean> | null = null;
let sessionExpiredHandler: SessionExpiredHandler | null = null;

export function setSessionExpiredHandler(handler: SessionExpiredHandler | null) {
  sessionExpiredHandler = handler;
}

async function refreshTokens(): Promise<boolean> {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      log.warn("api-call | Token refresh failed: no refresh token in cache");
      return false;
    }

    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const resData = await res.json();

    if (!res.ok) {
      log.error("api-call | Token refresh rejected:", { status: res.status, ...resData });
      return false;
    }

    if (typeof resData.accessToken !== "string" || typeof resData.refreshToken !== "string") {
      log.error("api-call | Token refresh rejected:", { status: res.status, ...resData });
      return false;
    }

    await saveTokens(resData.accessToken, resData.refreshToken);
    log.info("api-call | Token refresh successful.");
    return true;
  } catch (error) {
    log.error("api-call | Token refresh failed:", error);
    return false;
  }
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

export async function apiCall(
  endpoint: string,
  method: HttpMethod,
  options: RequestInit = {},
  isRetry = false,
) {
  const token = await getToken();
  const url = `${BASE_URL}${endpoint}`;
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
  const response = await fetch(url, config);
  const parsedResponse = await response.json();

  // Attempt token refresh on 401, but only once
  if (response.status === 401 && parsedResponse?.code === "ACCESS_TOKEN_EXPIRED" && !isRetry) {
    log.info("api-call | Access token expired, checking session...");

    const currentToken = await getToken();
    const sessionError: SessionError = {
      endpoint,
      method,
      status: 401,
      success: false,
      message: "Session expired",
      code: "SESSION_EXPIRED",
    };
    const handleSessionExpired = async () => {
      log.warn("api-call | Session expired, signing out...");
      await sessionExpiredHandler?.(sessionError);
      throw sessionError;
    };

    // This 401 may have arrived after another request already refreshed.
    if (currentToken && currentToken !== token) {
      return apiCall(endpoint, method, options, true);
    }

    if (!currentToken) {
      return handleSessionExpired();
    }

    // All concurrent 401 responses share one refresh request.
    const refreshSucceeded = await refreshTokensOnce();

    if (refreshSucceeded) {
      return apiCall(endpoint, method, options, true);
    } else {
      return handleSessionExpired();
    }
  }

  // API error
  if (!response.ok) {
    const errorData = parsedResponse ?? {
      success: false,
      message: response.statusText,
      code: "UNPARSEABLE_RESPONSE",
    };
    const apiError = {
      endpoint,
      method,
      status: response.status,
      success: errorData.success,
      message: errorData.message,
      code: errorData.code,
      ...(errorData.errors && { errors: errorData.errors }),
    };
    log.error("api-call | API Error:", JSON.stringify(apiError, null, 2));
    throw apiError;
  }

  const isBodySensitive = config.body && config.body.toString().includes("password");
  const isParsedResponseSensitive =
    parsedResponse?.data && Object.keys(parsedResponse.data).some((key) => key.includes("tokens"));

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
        data: isParsedResponseSensitive ? "[REDACTED]" : parsedResponse.data,
      },
      null,
      2,
    ),
  );

  return parsedResponse;
}
