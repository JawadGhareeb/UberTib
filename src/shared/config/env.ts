const publicApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

export const env = {
  apiUrl: publicApiUrl ? publicApiUrl.replace(/\/+$/, '') : undefined,
} as const;

export function getApiUrl(): string {
  if (!env.apiUrl) {
    throw new Error(
      'API URL is not configured. Set EXPO_PUBLIC_API_URL in a local .env file and restart Expo.',
    );
  }

  return env.apiUrl;
}
