import { ApiError, type ApiValidationError, type HttpMethod } from "@/shared/api/api-error";

export async function fetchResponse(
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

export async function parseJsonResponse(response: Response, endpoint: string, method: HttpMethod) {
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

export function createHttpError(
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

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function createInvalidResponseError(
  endpoint: string,
  method: HttpMethod,
  status: number | null,
) {
  return new ApiError({
    endpoint,
    method,
    status,
    code: "INVALID_RESPONSE",
    message: "The server returned an invalid response.",
  });
}

export function getValidationErrors(value: unknown): ApiValidationError[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const errors = value.filter(
    (error): error is ApiValidationError =>
      isRecord(error) && typeof error.field === "string" && typeof error.message === "string",
  );

  return errors.length > 0 ? errors : undefined;
}
