import { API_BASE_URL } from '../config';
import {
  CatalogItemInUseError,
  catalogItemInUseErrorFromResponse,
} from './catalogItemInUse';

export async function adminRequest(
  path: string,
  token: string,
  init?: RequestInit,
) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        ...init?.headers,
      },
    });

    if (!response.ok) {
      const inUseError = await catalogItemInUseErrorFromResponse(response);

      if (inUseError) {
        throw inUseError;
      }

      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    return response;
  } catch (error) {
    if (error instanceof CatalogItemInUseError) {
      throw error;
    }

    if (error instanceof Error && error.message.startsWith('Ошибка сервера')) {
      throw error;
    }

    throw new Error('Не удалось подключиться к серверу');
  }
}
