import type { User } from '../../types/user';
import { API_BASE_URL } from '../config';
import { AuthError } from './types';
import { GET_USER_ERROR_TYPES } from './user';

export type RoleNotificationKind = 'master' | 'landlord';

export interface MarkRoleNotificationReadRequest {
  token: string;
  kind: RoleNotificationKind;
}

interface MarkRoleNotificationReadResponse extends User {
  token: string;
}

function getErrorInfo(status: number): { type: string; message: string } {
  switch (status) {
    case 400:
    case 401:
      return {
        type: GET_USER_ERROR_TYPES.UNAUTHORIZED,
        message: 'Сессия истекла',
      };
    default:
      return {
        type: GET_USER_ERROR_TYPES.UNKNOWN,
        message: `Ошибка сервера: ${status}`,
      };
  }
}

export function userFromNotificationReadResponse(
  response: MarkRoleNotificationReadResponse
): User {
  return {
    id: response.id,
    phone: response.phone,
    firstName: response.firstName,
    lastName: response.lastName,
    roles: response.roles,
    createdAt: response.createdAt,
    landlordRoleStatus: response.landlordRoleStatus,
    masterRoleStatus: response.masterRoleStatus,
    landlordApplication: response.landlordApplication,
    masterApplication: response.masterApplication,
  };
}

export async function markRoleNotificationRead({
  token,
  kind,
}: MarkRoleNotificationReadRequest): Promise<User> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/users/notifications/${kind}/read`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const { type, message } = getErrorInfo(response.status);
      throw new AuthError(message, response.status, type);
    }

    const body = (await response.json()) as MarkRoleNotificationReadResponse;
    return userFromNotificationReadResponse(body);
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }

    throw new AuthError(
      'Не удалось подключиться к серверу',
      0,
      GET_USER_ERROR_TYPES.NETWORK
    );
  }
}
