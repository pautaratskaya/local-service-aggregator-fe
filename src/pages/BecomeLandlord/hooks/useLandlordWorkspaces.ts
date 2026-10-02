import { useQuery } from '@tanstack/react-query';
import type { LandlordWorkspaceSummary } from '../../../api/admin/listLandlords';
import { landlordService } from '../../../api/landlord/landlordService';
import { useAuthStore } from '../../../stores/authStore';
import { landlordWorkspacesQueryKey } from './landlordWorkspacesQueryKey';

const REJECTED_WORKSPACE_STATUS = 'REJECTED';

export function useLandlordWorkspaces(enabled: boolean) {
  const token = useAuthStore((state) => state.token);
  const userId = useAuthStore((state) => state.userId);

  return useQuery({
    queryKey: landlordWorkspacesQueryKey(userId),
    queryFn: () => {
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      return landlordService.listWorkspaces({ token });
    },
    enabled: enabled && !!token,
    staleTime: 0,
    gcTime: 0,
  });
}

export function pickRejectedWorkspace(
  workspaces: LandlordWorkspaceSummary[] | undefined,
): LandlordWorkspaceSummary | null {
  if (!workspaces?.length) {
    return null;
  }

  return (
    workspaces
      .filter((workspace) => workspace.status === REJECTED_WORKSPACE_STATUS)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] ?? null
  );
}
