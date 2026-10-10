import { API_BASE_URL } from '../config';
import type { RoleApplicationStatus } from '../../types/user';

export interface MasterSummary {
  id: number;
  name: string;
  speciality: string;
  photoUrl: string | null;
  averageRating: number | null;
  city: string | null;
  description: string | null;
}

export interface MasterRequestResponse {
  userId: number;
  phone: string;
  realName: string;
  master: MasterSummary;
}

export interface ListMastersRequest {
  token: string;
  roleRequestStatus: RoleApplicationStatus;
}

export async function listMasters({
  token,
  roleRequestStatus,
}: ListMastersRequest): Promise<MasterRequestResponse[]> {
  const params = new URLSearchParams({ roleRequestStatus });

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/masters?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
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
