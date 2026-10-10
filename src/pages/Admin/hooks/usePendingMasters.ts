import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../../api/admin/adminService';
import { useAuthStore } from '../../../stores/authStore';
import { ROLE_APPLICATION_STATUSES } from '../../../types/user';
import { pendingMastersQueryKey } from './mastersQueryKey';

export function usePendingMasters() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: pendingMastersQueryKey,
    queryFn: () => {
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      return adminService.listMasters({
        token,
        roleRequestStatus: ROLE_APPLICATION_STATUSES.WAITING_APPROVAL,
      });
    },
    enabled: !!token,
    staleTime: 0,
  });
}
