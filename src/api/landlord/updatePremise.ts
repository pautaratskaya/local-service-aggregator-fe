import type { Premise } from '../admin/listLandlords';
import {
  LANDLORD_PHOTO_CONFIG,
  type PremiseFormPayload,
  buildPremiseFormData,
  validatePhotos,
} from './formData';
import { LANDLORD_CONFLICT_FALLBACKS, landlordRequest } from './request';

export interface UpdatePremiseRequest {
  token: string;
  premiseId: number;
  payload: PremiseFormPayload;
}

export async function updatePremise({
  token,
  premiseId,
  payload,
}: UpdatePremiseRequest): Promise<Premise> {
  validatePhotos(payload.photos, LANDLORD_PHOTO_CONFIG, false);

  const response = await landlordRequest(
    `/landlord/premises/${premiseId}`,
    token,
    {
      method: 'PUT',
      body: buildPremiseFormData(payload),
    },
    { conflictFallback: LANDLORD_CONFLICT_FALLBACKS.PREMISE },
  );

  return response.json() as Promise<Premise>;
}
