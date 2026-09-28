import { ApiError } from '../errors';

export class LandlordError extends ApiError {
  constructor(message: string, statusCode: number, type: string) {
    super(message, statusCode, type);
    this.name = 'LandlordError';
  }
}

export const LANDLORD_ERROR_TYPES = {
  INVALID_PAYLOAD: 'INVALID_PAYLOAD',
  INVALID_PHOTO_COUNT: 'INVALID_PHOTO_COUNT',
  INVALID_PHOTO_FORMAT: 'INVALID_PHOTO_FORMAT',
  INVALID_PHOTO_SIZE: 'INVALID_PHOTO_SIZE',
  NETWORK: 'NETWORK',
  UNKNOWN: 'UNKNOWN',
} as const;
