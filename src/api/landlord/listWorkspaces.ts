import type { LandlordWorkspaceSummary } from '../admin/listLandlords';
import { API_BASE_URL } from '../config';
import { LANDLORD_ERROR_TYPES, LandlordError } from './types';

export interface ListWorkspacesRequest {
  token: string;
}

export async function listWorkspaces({
  token,
}: ListWorkspacesRequest): Promise<LandlordWorkspaceSummary[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/landlord/workspaces`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new LandlordError(
          'Требуется авторизация',
          response.status,
          LANDLORD_ERROR_TYPES.UNKNOWN,
        );
      }

      throw new LandlordError(
        `Ошибка сервера: ${response.status}`,
        response.status,
        LANDLORD_ERROR_TYPES.UNKNOWN,
      );
    }

    return response.json() as Promise<LandlordWorkspaceSummary[]>;
  } catch (error) {
    if (error instanceof LandlordError) {
      throw error;
    }

    throw new LandlordError(
      'Не удалось подключиться к серверу',
      0,
      LANDLORD_ERROR_TYPES.NETWORK,
    );
  }
}
