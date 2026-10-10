import { useQuery } from '@tanstack/react-query';
import { masterService } from '../../../api/master/masterService';
import { useAuthStore } from '../../../stores/authStore';

export function myMasterQueryKey(userId: number | null) {
  return ['my-master', userId] as const;
}

export function useMyMaster(enabled: boolean) {
  const token = useAuthStore((state) => state.token);
  const userId = useAuthStore((state) => state.userId);

  return useQuery({
    queryKey: myMasterQueryKey(userId),
    queryFn: () => {
      if (!token || userId == null) {
        throw new Error('Требуется авторизация');
      }

      return masterService.findMasterByUserId({ token, userId });
    },
    enabled: enabled && !!token && userId != null,
    staleTime: 0,
    gcTime: 0,
  });
}
