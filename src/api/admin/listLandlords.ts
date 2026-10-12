import { API_BASE_URL } from '../config';
import type { RoleApplicationStatus } from '../../types/user';

export const PREMISE_STATUSES = {
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export type PremiseStatus =
  (typeof PREMISE_STATUSES)[keyof typeof PREMISE_STATUSES];

export interface LandlordPhoto {
  id: number;
  url: string;
  order: number;
}

export interface Workspace {
  id: number;
  premisesId: number;
  workspaceTypeId: number;
  kind: string;
  description: string | null;
  minRentMinutes: number;
  pricePerHour: number;
  status: string;
  photos: LandlordPhoto[];
  serviceItemIds: number[];
  createdAt: string;
}

export interface Premise {
  id: number;
  ownerId: number;
  name: string;
  city: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  legalName: string | null;
  legalRegistrationNo: string | null;
  legalDetails: string | null;
  termsAcceptedAt: string | null;
  status: PremiseStatus;
  photos: LandlordPhoto[];
  workspaces: Workspace[];
  createdAt: string;
}

export interface LandlordResponse {
  userId: number;
  phone: string;
  realName: string;
  premises: Premise[];
}

export interface ListLandlordsRequest {
  token: string;
  roleRequestStatus: RoleApplicationStatus;
}

export async function listLandlords({
  token,
  roleRequestStatus,
}: ListLandlordsRequest): Promise<LandlordResponse[]> {
  const params = new URLSearchParams({ roleRequestStatus });

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/landlords?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Ошибка сервера')) {
      throw error;
    }

    throw new Error('Не удалось подключиться к серверу');
  }
}
