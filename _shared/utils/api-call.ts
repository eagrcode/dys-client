import { getToken, getRefreshToken, saveTokens } from "@/_shared/utils/token-manager";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000";

let refreshPromise: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      console.error("Token refresh failed: no refresh token in cache");
      return false;
    }

    const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshResponse.ok) {
      const errorData = await refreshResponse.json();
      console.error("Token refresh rejected:", refreshResponse.status, errorData);
      return false;
    }

    const refreshData = await refreshResponse.json();

    if (
      typeof refreshData.accessToken !== "string" ||
      typeof refreshData.refreshToken !== "string"
    ) {
      console.error("Token refresh returned malformed token data");
      return false;
    }

    await saveTokens(refreshData.accessToken, refreshData.refreshToken);
    console.log("Token refresh successful.");
    return true;
  } catch (error) {
    console.error("Token refresh failed:", error);
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
    console.log("Access token expired, checking session...");

    const currentToken = await getToken();

    // This 401 may have arrived after another request already refreshed.
    if (currentToken && currentToken !== token) {
      return apiCall(endpoint, method, options, true);
    }

    if (!currentToken) {
      throw {
        endpoint,
        method,
        status: 401,
        success: false,
        message: "Session expired",
        code: "SESSION_EXPIRED",
      };
    }

    // All concurrent 401 responses share one refresh request.
    const refreshSucceeded = await refreshTokensOnce();

    if (refreshSucceeded) {
      return apiCall(endpoint, method, options, true);
    }

    // Refresh failed or returned non-ok — session is dead
    console.error("Session expired, signing out...");

    const sessionError = {
      endpoint,
      method,
      status: 401,
      success: false,
      message: "Session expired",
      code: "SESSION_EXPIRED",
    };
    throw sessionError;
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
    console.warn("API Error:", JSON.stringify(apiError, null, 2));
    throw apiError;
  }

  const isBodySensitive = config.body && config.body.toString().includes("password");

  const isParsedResponseSensitive =
    parsedResponse?.data && Object.keys(parsedResponse.data).some((key) => key.includes("tokens"));

  console.log(
    "API Call:",
    JSON.stringify(
      { endpoint, method, body: isBodySensitive ? "[REDACTED]" : config.body },
      null,
      2,
    ),
  );
  console.log(
    "Response:",
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
