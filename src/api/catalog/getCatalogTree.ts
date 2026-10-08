import { API_BASE_URL } from '../config';

export interface CatalogService {
  id: number;
  name: string;
  description: string;
  durationMinutes: number;
}

export interface CatalogWorkspaceType {
  id: number;
  name: string;
  description: string;
  shared: boolean;
  services: CatalogService[];
}

export interface CatalogGroup {
  id: number;
  name: string;
  description: string;
  workspaceTypes: CatalogWorkspaceType[];
}

export async function getCatalogTree(): Promise<CatalogGroup[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/catalog/tree`);

    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    return response.json() as Promise<CatalogGroup[]>;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Ошибка сервера')) {
      throw error;
    }

    throw new Error('Не удалось подключиться к серверу');
  }
}
