import type {
  LandlordApplication,
  SubmitLandlordApplicationPayload,
} from '../../types/landlord';
import { API_BASE_URL } from '../config';
import {
  buildWorkspaceFormData,
  validateWorkspacePhotos,
} from './submitApplication';
import { LANDLORD_ERROR_TYPES, LandlordError } from './types';

export interface AddWorkspaceRequest {
  token: string;
  payload: SubmitLandlordApplicationPayload;
}

export async function addWorkspace({
  token,
  payload,
}: AddWorkspaceRequest): Promise<LandlordApplication> {
  validateWorkspacePhotos(payload);

  try {
    const response = await fetch(`${API_BASE_URL}/landlord/add-workspace`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: buildWorkspaceFormData(payload),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new LandlordError(
          'Требуется авторизация',
          response.status,
          LANDLORD_ERROR_TYPES.UNKNOWN,
        );
      }

      if (response.status === 403) {
        throw new LandlordError(
          'Добавлять рабочие места может только подтверждённый арендодатель',
          response.status,
          LANDLORD_ERROR_TYPES.UNKNOWN,
        );
      }

      if (response.status === 400) {
        throw new LandlordError(
          'Проверьте корректность данных формы',
          response.status,
          LANDLORD_ERROR_TYPES.INVALID_PAYLOAD,
        );
      }

      throw new LandlordError(
        `Ошибка сервера: ${response.status}`,
        response.status,
        LANDLORD_ERROR_TYPES.UNKNOWN,
      );
    }

    return response.json() as Promise<LandlordApplication>;
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
