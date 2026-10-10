import type { RoleApplicationStatus } from '../../types/user';
import { API_BASE_URL } from '../config';

export interface RequestMasterPayload {
  name: string;
  speciality: string;
  city?: string;
  description?: string;
}

export interface RequestMasterRequest {
  token: string;
  payload: RequestMasterPayload;
}

export interface MasterProfile {
  id: number;
  name: string;
  speciality: string;
  photoUrl: string;
  averageRating: number;
  city: string;
  description: string;
}

// TODO: remove all the fields from response. we need only status: 200/400/etc.
export interface RequestMasterResponse {
  userId: number;
  userName: string;
  masterStatus: RoleApplicationStatus;
  master: MasterProfile;
}

export async function requestMaster({
  token,
  payload,
}: RequestMasterRequest): Promise<RequestMasterResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/masters/request-master`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Требуется авторизация');
      }
      if (response.status === 400) {
        throw new Error('Проверьте корректность данных формы');
      }
      if (response.status === 409) {
        throw new Error(
          'Заявка уже на рассмотрении или роль мастера уже подтверждена',
        );
      }
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    return response.json() as Promise<RequestMasterResponse>;
  } catch (error) {
    if (
      error instanceof Error &&
      !error.message.startsWith('Failed to fetch')
    ) {
      throw error;
    }

    throw new Error('Не удалось подключиться к серверу');
  }
}
