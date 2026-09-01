import { API_BASE_URL } from '../config';
import { COMMON_ERROR_TYPES } from '../errors';
import { AuthError } from './types';

export const REQUEST_CODE_ERROR_TYPES = {
  INVALID_PHONE: 'INVALID_PHONE',
  SMS_FAILURE: 'SMS_FAILURE',
  ...COMMON_ERROR_TYPES,
} as const;

export type RequestCodeErrorType =
  (typeof REQUEST_CODE_ERROR_TYPES)[keyof typeof REQUEST_CODE_ERROR_TYPES];

export interface RequestCodeRequest {
  phone: string;
}

function getErrorInfo(status: number): {
  type: RequestCodeErrorType;
  message: string;
} {
  switch (status) {
    case 400:
      return {
        type: REQUEST_CODE_ERROR_TYPES.INVALID_PHONE,
        message: 'Неверный формат номера телефона',
      };
    case 500:
      return {
        type: REQUEST_CODE_ERROR_TYPES.SMS_FAILURE,
        message: 'Не удалось отправить SMS. Попробуйте позже',
      };
    default:
      return {
        type: REQUEST_CODE_ERROR_TYPES.UNKNOWN,
        message: `Ошибка сервера: ${status}`,
      };
  }
}

export async function requestCode(data: RequestCodeRequest): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/request-code`, {
      method: 'POST',
      // credentials: 'include', // TODO: token
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const { type, message } = getErrorInfo(response.status);
      throw new AuthError(message, response.status, type);
    }

    return response.text();
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }

    // Network or other errors
    throw new AuthError(
      'Не удалось подключиться к серверу',
      0,
      REQUEST_CODE_ERROR_TYPES.NETWORK
    );
  }
}
