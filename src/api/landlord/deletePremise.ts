import { LANDLORD_CONFLICT_FALLBACKS, landlordRequest } from './request';

export interface DeletePremiseRequest {
  token: string;
  premiseId: number;
}

export async function deletePremise({
  token,
  premiseId,
}: DeletePremiseRequest) {
  await landlordRequest(
    `/landlord/premises/${premiseId}`,
    token,
    { method: 'DELETE' },
    { conflictFallback: LANDLORD_CONFLICT_FALLBACKS.PREMISE },
  );
}
