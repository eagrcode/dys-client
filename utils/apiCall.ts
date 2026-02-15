import { getToken } from "@/services/tokenManager";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000";

export async function apiCall(endpoint: string, method: string, options: RequestInit = {}) {
  const token = getToken();

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

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      success: false,
      message: response.statusText,
      code: "NETWORK_ERROR",
    }));
    console.error(
      "API Error:",
      JSON.stringify(
        {
          endpoint,
          method,
          status: response.status,
          success: errorData.success,
          message: errorData.message,
          code: errorData.code,
          ...(errorData.errors && { errors: errorData.errors }),
        },
        null,
        2,
      ),
    );
    throw errorData;
  }

  const apiCallData = {
    endpoint,
    method,
    body: config.body,
  };
  const responseData = await response.clone().json();

  const responseObj = {
    status: responseData.status,
    success: responseData.success,
    data: responseData.data,
  };

  console.log("API Call:", JSON.stringify(apiCallData, null, 2));
  console.log("Response:", JSON.stringify(responseObj, null, 2));

  return responseData;
}
