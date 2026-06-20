import { getToken, getRefreshToken, saveTokens } from "@/services/tokenManager";
import { forceSignOut } from "@/lib/context/SessionProvider";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000";

let refreshPromise: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    console.error("Token refresh failed: no refresh token in cache");
    return false;
  }

  try {
    const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();
      await saveTokens(refreshData.accessToken, refreshData.refreshToken);
      console.log("Token refresh successful.");
      return true;
    }

    const errorData = await refreshResponse.json().catch(() => null);
    console.error("Token refresh rejected:", refreshResponse.status, errorData);

    return false;
  } catch (error) {
    console.error("Token refresh failed:", JSON.stringify(error, null, 2));
  }

  return false;
}

export async function apiCall(
  endpoint: string,
  method: string,
  options: RequestInit = {},
  isRetry = false,
) {
  const token = await getToken();

  const url = `${BASE_URL}${endpoint}`;
  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  // First attempt
  const response = await fetch(url, config);
  const resData = await response.json().catch(() => null);

  // Attempt token refresh on 401, but only once
  if (response.status === 401 && resData?.message === "Invalid token" && !isRetry) {
    console.log("Access token expired, attempting refresh...");

    // Deduplicate: all concurrent 401s share the same refresh attempt
    if (!refreshPromise) {
      refreshPromise = refreshTokens();
    }

    const refreshSucceeded = await refreshPromise;
    refreshPromise = null;

    if (refreshSucceeded) {
      return await apiCall(endpoint, method, options, true);
    }

    // Refresh failed or returned non-ok — session is dead
    console.error("Session expired, signing out...");
    await forceSignOut();

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
    const errorData = resData ?? {
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

  console.log("API Call:", JSON.stringify({ endpoint, method, body: config.body }, null, 2));
  console.log(
    "Response:",
    JSON.stringify(
      { status: resData.status, success: resData.success, data: resData.data },
      null,
      2,
    ),
  );

  return resData;
}
