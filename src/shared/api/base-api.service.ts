import type { AxiosRequestConfig } from 'axios';

import { httpClient, toApiError } from '@/shared/api/http-client';
import type { ApiError } from '@/shared/types/api';

/** Required for commands so an unknown network outcome can be reconciled safely. */
export interface ApiWriteOptions {
  idempotencyKey: string;
  expectedVersion?: string;
}

export class BaseApiServiceError extends Error {
  readonly status?: number;
  readonly details?: unknown;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'BaseApiServiceError';
    this.status = error.status;
    this.details = error.details;
  }
}

async function request<TResponse>(
  config: AxiosRequestConfig,
  writeOptions?: ApiWriteOptions,
): Promise<TResponse> {
  const method = (config.method ?? 'GET').toUpperCase();
  const isWrite = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

  if (isWrite && !writeOptions?.idempotencyKey.trim()) {
    throw new BaseApiServiceError({
      message: `Idempotency-Key is required for ${method} requests.`,
    });
  }

  try {
    const response = await httpClient.request<TResponse>({
      ...config,
      method,
      headers: {
        ...config.headers,
        ...(isWrite ? { 'Idempotency-Key': writeOptions!.idempotencyKey } : {}),
        ...(writeOptions?.expectedVersion ? { 'If-Match': writeOptions.expectedVersion } : {}),
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof BaseApiServiceError) throw error;
    throw new BaseApiServiceError(toApiError(error));
  }
}

/**
 * Common transport facade only. Endpoint paths, DTO validation, query keys,
 * business permissions and mutation orchestration belong to feature modules.
 * No live endpoints are configured here, and mock-first screens never call it.
 */
export const baseApiService = {
  request,
  get: <TResponse>(url: string, config?: Omit<AxiosRequestConfig, 'url' | 'method'>) =>
    request<TResponse>({ ...config, method: 'GET', url }),
  post: <TResponse>(
    url: string,
    data: unknown,
    options: ApiWriteOptions,
    config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'data'>,
  ) => request<TResponse>({ ...config, method: 'POST', url, data }, options),
  put: <TResponse>(
    url: string,
    data: unknown,
    options: ApiWriteOptions,
    config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'data'>,
  ) => request<TResponse>({ ...config, method: 'PUT', url, data }, options),
  patch: <TResponse>(
    url: string,
    data: unknown,
    options: ApiWriteOptions,
    config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'data'>,
  ) => request<TResponse>({ ...config, method: 'PATCH', url, data }, options),
  delete: <TResponse>(
    url: string,
    options: ApiWriteOptions,
    config?: Omit<AxiosRequestConfig, 'url' | 'method'>,
  ) => request<TResponse>({ ...config, method: 'DELETE', url }, options),
};
