import { API_BASE_URL } from '../config';

export interface WorkspaceType {
  id: number;
  workspaceName: string;
}

export async function listWorkspaceTypes(): Promise<WorkspaceType[]> {
  const response = await fetch(`${API_BASE_URL}/api/catalog/workspace-types`);

  if (!response.ok) {
    throw new Error(`Ошибка сервера: ${response.status}`);
  }

  return response.json() as Promise<WorkspaceType[]>;
}
