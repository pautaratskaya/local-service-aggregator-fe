import { useQuery } from '@tanstack/react-query';
import { landlordService } from '../api/landlord/landlordService';
import { useAuthStore } from '../stores/authStore';
import { landlordWorkspacesQueryKey } from './landlordWorkspacesQueryKey';

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
