import { adminRequest } from './adminRequest';

export interface AdminServiceGroup {
  id: number;
  name: string;
  description: string;
}

export interface AdminServiceGroupPayload {
  name: string;
  description: string;
}

export async function getServiceGroup(
  token: string,
  id: number,
): Promise<AdminServiceGroup> {
  const response = await adminRequest(`/api/admin/service-groups/${id}`, token);

  return response.json() as Promise<AdminServiceGroup>;
}

export async function updateServiceGroup(
  token: string,
  id: number,
  payload: AdminServiceGroupPayload,
): Promise<AdminServiceGroup> {
  const response = await adminRequest(
    `/api/admin/service-groups/${id}`,
    token,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );

  return response.json() as Promise<AdminServiceGroup>;
}

export async function createServiceGroup(
  token: string,
  payload: AdminServiceGroupPayload,
): Promise<AdminServiceGroup> {
  const response = await adminRequest('/api/admin/service-groups', token, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return response.json() as Promise<AdminServiceGroup>;
}

export async function deleteServiceGroup(
  token: string,
  id: number,
): Promise<void> {
  await adminRequest(`/api/admin/service-groups/${id}`, token, {
    method: 'DELETE',
  });
}
