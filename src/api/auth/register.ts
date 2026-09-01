import type { User } from '../../types/user';
import { API_BASE_URL } from '../config';
import { COMMON_ERROR_TYPES } from '../errors';
import { AuthError } from './types';

export const REGISTER_ERROR_TYPES = {
  INVALID_PAYLOAD: 'INVALID_PAYLOAD',
  PHONE_ALREADY_REGISTERED: 'PHONE_ALREADY_REGISTERED',
} as const;

export type RegisterErrorType =
  (typeof REGISTER_ERROR_TYPES)[keyof typeof REGISTER_ERROR_TYPES];

export interface RegisterRequest {
  phone: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponse extends User {
  token: string;
}

function getErrorInfo(status: number): {
  type: RegisterErrorType | string;
  message: string;
} {
  switch (status) {
    case 400:
      return {
        type: REGISTER_ERROR_TYPES.INVALID_PAYLOAD,
        message: 'Неверный формат данных',
      };
    case 409:
      return {
        type: REGISTER_ERROR_TYPES.PHONE_ALREADY_REGISTERED,
        message: 'Этот номер телефона уже зарегистрирован',
      };
    default:
      return {
        type: COMMON_ERROR_TYPES.UNKNOWN,
        message: 'Произошла неизвестная ошибка',
      };
  }
}

export async function register(
  data: RegisterRequest
): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
      method: 'POST',
      // credentials: 'include', // TODO: token
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorInfo = getErrorInfo(response.status);
      throw new AuthError(errorInfo.message, response.status, errorInfo.type);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }

    throw new AuthError(
      'Не удалось подключиться к серверу',
      0,
      COMMON_ERROR_TYPES.NETWORK
    );
  }
}
