export const COMMON_ERROR_TYPES = {
  UNKNOWN: 'UNKNOWN',
  NETWORK: 'NETWORK',
} as const;

export type CommonErrorType =
  (typeof COMMON_ERROR_TYPES)[keyof typeof COMMON_ERROR_TYPES];

export class ApiError extends Error {
  statusCode: number;
  type: string;

  constructor(message: string, statusCode: number, type: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.type = type;
  }
}
