import { API_BASE_URL } from '../config';
import type { LandlordApplicationStatus } from '../../types/landlord';

export interface LandlordWorkspacePhoto {
  id: number;
  url: string;
  order: number;
}

export interface LandlordWorkspaceSummary {
  id: number;
  name: string;
  city: string;
  address: string;
  photos: LandlordWorkspacePhoto[];
}

export interface LandlordResponse {
  userId: number;
  phone: string;
  realName: string;
  workspaces: LandlordWorkspaceSummary[];
}

export interface ListLandlordsRequest {
  token: string;
  roleRequestStatus: LandlordApplicationStatus;
}

export async function listLandlords({
  token,
  roleRequestStatus,
}: ListLandlordsRequest): Promise<LandlordResponse[]> {
  const params = new URLSearchParams({ roleRequestStatus });

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/landlords?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Ошибка сервера')) {
      throw error;
    }

    throw new Error('Не удалось подключиться к серверу');
  }
}
