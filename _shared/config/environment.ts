const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error(
    "Missing EXPO_PUBLIC_API_BASE_URL. Add it to your local environment or selected EAS environment.",
  );
}

export const API_BASE_URL = apiBaseUrl.replace(/\/+$/, "");
