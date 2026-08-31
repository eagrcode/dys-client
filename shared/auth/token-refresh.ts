import { getRefreshToken, saveTokens } from "@/shared/storage/token-manager";
import { API_BASE_URL } from "@/shared/config/environment";
import {
  fetchResponse,
  parseJsonResponse,
  createHttpError,
  isRecord,
  createInvalidResponseError,
} from "@/shared/api/api-helpers";
import { log } from "../logging/logger";

const REFRESH_ENDPOINT = "/auth/refresh";

let refreshPromise: Promise<boolean> | null = null;

export async function refreshTokens(): Promise<boolean> {
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

export async function performRefreshTokens(): Promise<boolean> {
  // throw new Error("TEST_REFRESH_FAILURE");

  const pending = refreshPromise ?? (refreshPromise = refreshTokens());

  try {
    return await pending;
  } finally {
    if (refreshPromise === pending) {
      refreshPromise = null;
    }
  }
}
