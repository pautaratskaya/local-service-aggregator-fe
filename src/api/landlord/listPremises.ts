import type { Premise } from '../admin/listLandlords';
import { LANDLORD_CONFLICT_FALLBACKS, landlordRequest } from './request';

export interface ListPremisesRequest {
  token: string;
}

export async function listPremises({
  token,
}: ListPremisesRequest): Promise<Premise[]> {
  const response = await landlordRequest(
    '/landlord/premises',
    token,
    { method: 'GET' },
    { conflictFallback: LANDLORD_CONFLICT_FALLBACKS.PREMISE },
  );

  return response.json() as Promise<Premise[]>;
}
