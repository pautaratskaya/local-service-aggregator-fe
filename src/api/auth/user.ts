import type { User } from '../../types/user';
import { API_BASE_URL } from '../config';
import { COMMON_ERROR_TYPES } from '../errors';
import { AuthError } from './types';

export const GET_USER_ERROR_TYPES = {
  NOT_FOUND: 'NOT_FOUND',
  ...COMMON_ERROR_TYPES,
} as const;

export type GetUserErrorType =
  (typeof GET_USER_ERROR_TYPES)[keyof typeof GET_USER_ERROR_TYPES];

export interface GetUserRequest {
  userId: number;
}

function getErrorInfo(status: number): {
  type: GetUserErrorType;
  message: string;
} {
  switch (status) {
    case 404:
      return {
        type: GET_USER_ERROR_TYPES.NOT_FOUND,
        message: 'Пользователь не найден',
      };
    default:
      return {
        type: GET_USER_ERROR_TYPES.UNKNOWN,
        message: `Ошибка сервера: ${status}`,
      };
  }
}

export async function getUser(data: GetUserRequest): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${data.userId}`, {
      method: 'GET',
      // credentials: 'include', // TODO: token
      headers: {
        'Content-Type': 'application/json',
      },
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
      GET_USER_ERROR_TYPES.NETWORK
    );
  }
}
