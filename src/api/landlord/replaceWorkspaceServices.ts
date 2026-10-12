import { LANDLORD_CONFLICT_FALLBACKS, landlordRequest } from './request';

export interface ReplaceWorkspaceServicesRequest {
  token: string;
  workspaceId: number;
  serviceItemIds: number[];
}

export async function replaceWorkspaceServices({
  token,
  workspaceId,
  serviceItemIds,
}: ReplaceWorkspaceServicesRequest) {
  await landlordRequest(
    `/landlord/workspaces/${workspaceId}/services`,
    token,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceItemIds }),
    },
    { conflictFallback: LANDLORD_CONFLICT_FALLBACKS.WORKSPACE },
  );
}
