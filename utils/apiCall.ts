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
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const apiCallData = {
    endpoint,
    method,
    status: response.status,
  };
  const responseData = await response.clone().json();

  console.log("API Call:", JSON.stringify(apiCallData, null, 2));
  console.log("Response:", JSON.stringify(responseData, null, 2));

  return responseData;
}
