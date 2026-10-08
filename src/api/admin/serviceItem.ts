import { adminRequest } from './adminRequest';

export interface AdminServiceItem {
  id: number;
  workspaceTypeId: number;
  name: string;
  description: string | null;
  durationMinutes: number;
}

export interface AdminServiceItemPayload {
  name: string;
  description: string;
  durationMinutes: number;
}

export async function getServiceItem(
  token: string,
  id: number,
): Promise<AdminServiceItem> {
  const response = await adminRequest(
    `/api/admin/services/${id}`,
    token,
  );

  return response.json() as Promise<AdminServiceItem>;
}

export async function updateServiceItem(
  token: string,
  id: number,
  payload: AdminServiceItemPayload,
): Promise<AdminServiceItem> {
  const response = await adminRequest(
    `/api/admin/services/${id}`,
    token,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );

  return response.json() as Promise<AdminServiceItem>;
}

export async function createServiceItem(
  token: string,
  workspaceTypeId: number,
  payload: AdminServiceItemPayload,
): Promise<AdminServiceItem> {
  const response = await adminRequest(
    `/api/admin/workspace-types/${workspaceTypeId}/services`,
    token,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );

  return response.json() as Promise<AdminServiceItem>;
}

export async function deleteServiceItem(
  token: string,
  id: number,
): Promise<void> {
  await adminRequest(`/api/admin/services/${id}`, token, {
    method: 'DELETE',
  });
}
