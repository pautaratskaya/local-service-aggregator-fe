import { adminRequest } from './adminRequest';

export interface AdminWorkspaceType {
  id: number;
  groupId: number;
  name: string;
  description: string;
  shared: boolean;
}

export interface AdminWorkspaceTypePayload {
  name: string;
  description: string;
  shared: boolean;
}

export async function getWorkspaceType(
  token: string,
  id: number,
): Promise<AdminWorkspaceType> {
  const response = await adminRequest(
    `/api/admin/workspace-types/${id}`,
    token,
  );

  return response.json() as Promise<AdminWorkspaceType>;
}

export async function updateWorkspaceType(
  token: string,
  id: number,
  payload: AdminWorkspaceTypePayload,
): Promise<AdminWorkspaceType> {
  const response = await adminRequest(
    `/api/admin/workspace-types/${id}`,
    token,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );

  return response.json() as Promise<AdminWorkspaceType>;
}

export async function createWorkspaceType(
  token: string,
  groupId: number,
  payload: AdminWorkspaceTypePayload,
): Promise<AdminWorkspaceType> {
  const response = await adminRequest(
    `/api/admin/service-groups/${groupId}/workspace-types`,
    token,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );

  return response.json() as Promise<AdminWorkspaceType>;
}

export async function deleteWorkspaceType(
  token: string,
  id: number,
): Promise<void> {
  await adminRequest(`/api/admin/workspace-types/${id}`, token, {
    method: 'DELETE',
  });
}
