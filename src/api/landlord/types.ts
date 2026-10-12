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

export const LANDLORD_CONFLICT_CODES = {
  PREMISES_LIMIT_REACHED: 'PREMISES_LIMIT_REACHED',
  PREMISES_HAS_ACTIVE_BOOKINGS: 'PREMISES_HAS_ACTIVE_BOOKINGS',
  PREMISES_NOT_APPROVED: 'PREMISES_NOT_APPROVED',
} as const;

export type LandlordConflictCode =
  (typeof LANDLORD_CONFLICT_CODES)[keyof typeof LANDLORD_CONFLICT_CODES];

const CONFLICT_MESSAGES: Record<LandlordConflictCode, string> = {
  PREMISES_LIMIT_REACHED: 'Можно добавить не больше 3 помещений',
  PREMISES_HAS_ACTIVE_BOOKINGS:
    'Нельзя удалить помещение, пока есть будущие брони',
  PREMISES_NOT_APPROVED: 'Помещение ещё не одобрено',
};

export function landlordConflictMessage(
  code: string | undefined,
  fallback: string,
) {
  if (code && code in CONFLICT_MESSAGES) {
    return CONFLICT_MESSAGES[code as LandlordConflictCode];
  }

  return fallback;
}
