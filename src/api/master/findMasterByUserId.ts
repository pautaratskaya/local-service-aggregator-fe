import { API_BASE_URL } from '../config';

export interface MasterRecord {
  id: number;
  name: string;
  speciality: string;
  userId: number | null;
  city: string | null;
  bio: string | null;
}

export interface FindMasterByUserIdRequest {
  token: string;
  userId: number;
}

export async function findMasterByUserId({
  token,
  userId,
}: FindMasterByUserIdRequest): Promise<MasterRecord | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/masters/list`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    const masters = (await response.json()) as MasterRecord[];

    return masters.find((master) => master.userId === userId) ?? null;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Ошибка сервера')) {
      throw error;
    }

    throw new Error('Не удалось подключиться к серверу');
  }
}
