import { API_BASE_URL } from '../config';

export interface ApproveMasterRequest {
  token: string;
  userId: number;
}

export async function approveMaster({
  token,
  userId,
}: ApproveMasterRequest): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/approve-master`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Ошибка сервера')) {
      throw error;
    }

    throw new Error('Не удалось подключиться к серверу');
  }
}
