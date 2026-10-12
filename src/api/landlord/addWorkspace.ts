import type { Workspace } from '../admin/listLandlords';
import {
  WORKSPACE_PHOTO_CONFIG,
  type WorkspaceFormPayload,
  buildWorkspaceFormData,
  validatePhotos,
} from './formData';
import { LANDLORD_CONFLICT_FALLBACKS, landlordRequest } from './request';

export interface AddWorkspaceRequest {
  token: string;
  premiseId: number;
  payload: WorkspaceFormPayload & { photos: File[] };
}

export async function addWorkspace({
  token,
  premiseId,
  payload,
}: AddWorkspaceRequest): Promise<Workspace> {
  validatePhotos(payload.photos, WORKSPACE_PHOTO_CONFIG, true);

  const response = await landlordRequest(
    `/landlord/premises/${premiseId}/workspaces`,
    token,
    {
      method: 'POST',
      body: buildWorkspaceFormData(payload),
    },
    { conflictFallback: LANDLORD_CONFLICT_FALLBACKS.WORKSPACE },
  );

  return response.json() as Promise<Workspace>;
}
