import * as SecureStore from "expo-secure-store";

// Memory cache
let cachedToken: string | null = null;
let cachedRefreshToken: string | null = null;

// Initialize tokens from storage (call on app start)
export async function initializeToken(): Promise<{
  token: string | null;
  refreshToken: string | null;
}> {
  cachedToken = await SecureStore.getItemAsync("userToken");
  cachedRefreshToken = await SecureStore.getItemAsync("refreshToken");
  return { token: cachedToken, refreshToken: cachedRefreshToken };
}

// Get current access token from cache
export function getToken(): string | null {
  return cachedToken;
}

// Get current refresh token from cache
export function getRefreshToken(): string | null {
  return cachedRefreshToken;
}

// Save both tokens at once
export async function saveTokens(token: string, refreshToken: string): Promise<void> {
  cachedToken = token;
  cachedRefreshToken = refreshToken;
  await SecureStore.setItemAsync("userToken", token);
  await SecureStore.setItemAsync("refreshToken", refreshToken);
}

// Save just access token (after refresh)
export async function saveToken(token: string): Promise<void> {
  cachedToken = token;
  await SecureStore.setItemAsync("userToken", token);
}

// Clear all tokens
export async function clearTokens(): Promise<void> {
  cachedToken = null;
  cachedRefreshToken = null;
  await SecureStore.deleteItemAsync("userToken");
  await SecureStore.deleteItemAsync("refreshToken");
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return cachedToken !== null;
}
