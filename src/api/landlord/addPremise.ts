import type { Premise } from '../admin/listLandlords';
import {
  LANDLORD_PHOTO_CONFIG,
  type PremiseFormPayload,
  buildPremiseFormData,
  validatePhotos,
} from './formData';
import { LANDLORD_CONFLICT_FALLBACKS, landlordRequest } from './request';

export interface AddPremiseRequest {
  token: string;
  payload: PremiseFormPayload & { photos: File[] };
}

export async function addPremise({
  token,
  payload,
}: AddPremiseRequest): Promise<Premise> {
  validatePhotos(payload.photos, LANDLORD_PHOTO_CONFIG, true);

  const response = await landlordRequest(
    '/landlord/premises',
    token,
    {
      method: 'POST',
      body: buildPremiseFormData(payload),
    },
    {
      conflictFallback: LANDLORD_CONFLICT_FALLBACKS.PREMISE,
      forbiddenMessage:
        'Добавлять помещения может только подтверждённый арендодатель',
    },
  );

  return response.json() as Promise<Premise>;
}
