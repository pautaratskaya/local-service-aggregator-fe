import type { User } from '../../types/user';
import { API_BASE_URL } from '../config';
import { COMMON_ERROR_TYPES } from '../errors';
import { AuthError } from './types';

export const LOGIN_ERROR_TYPES = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  INVALID_CODE: 'INVALID_CODE',
  ...COMMON_ERROR_TYPES,
} as const;

export type LoginErrorType =
  (typeof LOGIN_ERROR_TYPES)[keyof typeof LOGIN_ERROR_TYPES];

export interface LoginRequest {
  phone: string;
  code: string;
}

export interface LoginResponse extends User {
  token: string; // TODO: remove
}

function getErrorInfo(status: number): {
  type: LoginErrorType;
  message: string;
} {
  switch (status) {
    case 404:
      return {
        type: LOGIN_ERROR_TYPES.USER_NOT_FOUND,
        message: 'Пользователь не найден',
      };
    case 409:
      return {
        type: LOGIN_ERROR_TYPES.INVALID_CODE,
        message: 'Неверный код',
      };
    default:
      return {
        type: LOGIN_ERROR_TYPES.UNKNOWN,
        message: `Ошибка сервера: ${status}`,
      };
  }
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
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

    return response.json();
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }

    // Network or other errors
    throw new AuthError(
      'Не удалось подключиться к серверу',
      0,
      LOGIN_ERROR_TYPES.NETWORK
    );
  }
}
