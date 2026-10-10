import { API_BASE_URL } from '../config';

export interface RejectMasterRequest {
  token: string;
  userId: number;
  reason?: string;
}

export async function rejectMaster({
  token,
  userId,
  reason,
}: RejectMasterRequest): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/reject-master`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        ...(reason ? { reason } : {}),
      }),
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
