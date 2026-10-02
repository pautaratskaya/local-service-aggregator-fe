import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../../api/admin/adminService';
import { useAuthStore } from '../../../stores/authStore';
import { ROLE_APPLICATION_STATUSES } from '../../../types/user';
import { pendingLandlordsQueryKey } from './landlordsQueryKey';

export function usePendingLandlords() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: pendingLandlordsQueryKey,
    queryFn: () => {
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      return adminService.listLandlords({
        token,
        roleRequestStatus: ROLE_APPLICATION_STATUSES.WAITING_APPROVAL,
      });
    },
    enabled: !!token,
  });
}
