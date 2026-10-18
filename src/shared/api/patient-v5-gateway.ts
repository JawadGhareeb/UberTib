import { httpClient, toApiError } from '@/shared/api/http-client';
import type {
  PatientV5Operation,
  PatientV5Request,
  PatientV5Response,
} from '@/shared/api/patient-v5-contract';

/**
 * Transport boundary; UI components must not construct raw API URLs.
 * Register endpoints only after backend Swagger paths/payloads are approved.
 */
export interface PatientV5Endpoint<K extends PatientV5Operation> {
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  path: (input: PatientV5Request<K>) => string;
  query?: (input: PatientV5Request<K>) => Record<string, string | number | boolean | undefined>;
  body?: (input: PatientV5Request<K>) => unknown;
}

export type PatientV5EndpointRegistry = Partial<{
  [K in PatientV5Operation]: PatientV5Endpoint<K>;
}>;

export interface PatientV5RequestOptions {
  /**
   * Mandatory for every write. Reuse the SAME key after timeouts or an
   * unknown response. The server must dedupe at the command boundary.
   */
  idempotencyKey?: string;
  /** Optimistic concurrency for accepting plan versions and other decisions. */
  expectedVersion?: string;
}

export class PatientV5BackendNotConfiguredError extends Error {
  readonly code = 'PATIENT_V5_BACKEND_NOT_CONFIGURED';

  constructor(operation: PatientV5Operation) {
    super(`Patient V5 backend route not configured for: ${operation}`);
    this.name = 'PatientV5BackendNotConfiguredError';
  }
}

export class PatientV5RequestError extends Error {
  readonly code = 'PATIENT_V5_REQUEST_FAILED';
  readonly httpStatus?: number;

  constructor(message: string, httpStatus?: number) {
    super(message);
    this.name = 'PatientV5RequestError';
    this.httpStatus = httpStatus;
  }
}

const writeMethods = new Set<PatientV5Endpoint<PatientV5Operation>['method']>([
  'POST', 'PUT', 'PATCH', 'DELETE',
]);

/**
 * The gateway deliberately has no fallback to mock data and no default paths.
 * Existing mock screen adapters remain separate until their real endpoint is
 * contracted and QA-verified. Missing config fails loudly and safely.
 */
export function createPatientV5Gateway(registry: PatientV5EndpointRegistry) {
  return {
    async request<K extends PatientV5Operation>(
      operation: K,
      input: PatientV5Request<K>,
      options: PatientV5RequestOptions = {},
    ): Promise<PatientV5Response<K>> {
      const endpoint = registry[operation] as PatientV5Endpoint<K> | undefined;
      if (!endpoint) throw new PatientV5BackendNotConfiguredError(operation);

      const isWrite = writeMethods.has(endpoint.method);
      if (isWrite && !options.idempotencyKey) {
        throw new PatientV5RequestError(
          `Idempotency-Key is required for mutation: ${operation}`,
        );
      }

      try {
        const { data } = await httpClient.request<PatientV5Response<K>>({
          method: endpoint.method,
          url: endpoint.path(input),
          params: endpoint.query?.(input),
          data: isWrite ? endpoint.body?.(input) ?? input : undefined,
          headers: {
            ...(isWrite ? { 'Idempotency-Key': options.idempotencyKey! } : {}),
            ...(options.expectedVersion ? { 'If-Match': options.expectedVersion } : {}),
          },
        });

        if (data === null || data === undefined) {
          throw new PatientV5RequestError(
            `Empty backend response for: ${operation}`,
          );
        }
        // Network DTO validation must be added using the approved Swagger
        // shapes before wiring a real resource into a patient screen.
        return data;
      } catch (error) {
        if (error instanceof PatientV5RequestError) throw error;
        const normalized = toApiError(error);
        throw new PatientV5RequestError(normalized.message, normalized.status);
      }
    },
  };
}

/**
 * Intentionally empty on main while the backend contract is unavailable.
 * Register the server-approved paths in a feature-owned adapter; do not
 * guess URLs or silently switch the UI from mock to live.
 */
export const patientV5Gateway = createPatientV5Gateway({});
