import type { Premise } from '../admin/listLandlords';
import type { RoleApplicationStatus } from '../../types/user';
import type { SubmitLandlordApplicationPayload } from '../../types/landlord';
import {
  LANDLORD_PHOTO_CONFIG,
  buildPremiseFormData,
  toPremiseFormPayload,
  validatePhotos,
} from './formData';
import { LANDLORD_CONFLICT_FALLBACKS, landlordRequest } from './request';
import { LANDLORD_ERROR_TYPES, LandlordError } from './types';

export interface SubmitLandlordApplicationRequest {
  token: string;
  payload: SubmitLandlordApplicationPayload;
}

export interface BecomeLandlordResponse {
  userId: number;
  userName: string;
  landlordStatus: RoleApplicationStatus;
  premises: Premise;
}

export async function submitApplication({
  token,
  payload,
}: SubmitLandlordApplicationRequest): Promise<BecomeLandlordResponse> {
  if (!payload.termsAccepted) {
    throw new LandlordError(
      'Подтвердите согласие с условиями для арендодателей',
      400,
      LANDLORD_ERROR_TYPES.INVALID_PAYLOAD,
    );
  }

  const premise = toPremiseFormPayload(payload);
  validatePhotos(premise.photos, LANDLORD_PHOTO_CONFIG, true);

  const response = await landlordRequest(
    '/landlord/request-landlord',
    token,
    {
      method: 'POST',
      body: buildPremiseFormData(premise, { termsAccepted: true }),
    },
    { conflictFallback: LANDLORD_CONFLICT_FALLBACKS.APPLICATION },
  );

  return response.json() as Promise<BecomeLandlordResponse>;
}
