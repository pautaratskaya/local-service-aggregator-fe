import { API_BASE_URL } from '../config';
import type { RoleApplicationStatus } from '../../types/user';

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
  kind: string;
  description: string;
  openTime: string;
  closeTime: string;
  workingDays: string[];
  minRentMinutes: number;
  pricePerHour: number;
  legalName: string | null;
  legalRegistrationNo: string | null;
  legalDetails: string | null;
  status: string;
  createdAt: string;
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
  roleRequestStatus: RoleApplicationStatus;
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
