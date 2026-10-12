import { LANDLORD_CONFLICT_FALLBACKS, landlordRequest } from './request';

export interface DeleteWorkspaceRequest {
  token: string;
  workspaceId: number;
}

export async function deleteWorkspace({
  token,
  workspaceId,
}: DeleteWorkspaceRequest) {
  await landlordRequest(
    `/landlord/workspaces/${workspaceId}`,
    token,
    { method: 'DELETE' },
    { conflictFallback: LANDLORD_CONFLICT_FALLBACKS.WORKSPACE },
  );
}
