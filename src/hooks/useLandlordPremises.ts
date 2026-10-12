import { useQuery } from '@tanstack/react-query';
import { landlordService } from '../api/landlord/landlordService';
import { useAuthStore } from '../stores/authStore';
import { landlordPremisesQueryKey } from './landlordPremisesQueryKey';

export function useLandlordPremises(enabled: boolean) {
  const token = useAuthStore((state) => state.token);
  const userId = useAuthStore((state) => state.userId);

  return useQuery({
    queryKey: landlordPremisesQueryKey(userId),
    queryFn: () => {
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      return landlordService.listPremises({ token });
    },
    enabled: enabled && !!token,
    staleTime: 0,
    gcTime: 0,
  });
}
