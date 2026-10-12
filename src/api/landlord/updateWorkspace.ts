import type { Workspace } from '../admin/listLandlords';
import {
  WORKSPACE_PHOTO_CONFIG,
  type WorkspaceFormPayload,
  buildWorkspaceFormData,
  validatePhotos,
} from './formData';
import { LANDLORD_CONFLICT_FALLBACKS, landlordRequest } from './request';

export interface UpdateWorkspaceRequest {
  token: string;
  workspaceId: number;
  payload: WorkspaceFormPayload;
}

export async function updateWorkspace({
  token,
  workspaceId,
  payload,
}: UpdateWorkspaceRequest): Promise<Workspace> {
  validatePhotos(payload.photos, WORKSPACE_PHOTO_CONFIG, false);

  const response = await landlordRequest(
    `/landlord/workspaces/${workspaceId}`,
    token,
    {
      method: 'PUT',
      body: buildWorkspaceFormData(payload),
    },
    { conflictFallback: LANDLORD_CONFLICT_FALLBACKS.WORKSPACE },
  );

  return response.json() as Promise<Workspace>;
}
