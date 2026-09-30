import { API_BASE_URL } from '../config';

export interface RejectLandlordRequest {
  token: string;
  userId: number;
}

export async function rejectLandlord({
  token,
  userId,
}: RejectLandlordRequest): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/reject-landlord`, {
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
