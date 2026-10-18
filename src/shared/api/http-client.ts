import { create, isAxiosError } from 'axios';

import { getApiUrl } from '@/shared/config/env';
import { secureStorage } from '@/shared/storage/secure-storage';
import type { ApiError } from '@/shared/types/api';

interface ErrorResponse {
  message?: string;
}

export const httpClient = create({
  timeout: 20_000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use(async (config) => {
  if (!config.baseURL && config.url?.startsWith('/')) {
    config.baseURL = getApiUrl();
  }

  const token = await secureStorage.getAccessToken();

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});

export function toApiError(error: unknown): ApiError {
  if (isAxiosError<ErrorResponse>(error)) {
    return {
      message: error.response?.data?.message ?? error.message,
      status: error.response?.status,
      details: error.response?.data,
    };
  }

  return {
    message: error instanceof Error ? error.message : 'Unexpected error',
  };
}
