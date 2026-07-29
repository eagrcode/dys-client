export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type ApiValidationError = {
  field: string;
  message: string;
};

type ApiErrorOptions = {
  message: string;
  code: string;
  status: number | null;
  endpoint: string;
  method: HttpMethod;
  errors?: ApiValidationError[];
};

export class ApiError extends Error {
  readonly code: string;
  readonly status: number | null;
  readonly endpoint: string;
  readonly method: HttpMethod;
  readonly errors?: ApiValidationError[];

  constructor({ message, code, status, endpoint, method, errors }: ApiErrorOptions) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.endpoint = endpoint;
    this.method = method;
    this.errors = errors;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      endpoint: this.endpoint,
      method: this.method,
      ...(this.errors && { errors: this.errors }),
    };
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function shouldRetryApiError(failureCount: number, error: unknown): boolean {
  if (!isApiError(error) || failureCount >= 2) {
    return false;
  }

  return error.code === "NETWORK_ERROR" || (error.status !== null && error.status >= 500);
}
