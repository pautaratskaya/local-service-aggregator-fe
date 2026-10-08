import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../../api/admin/adminService';
import { useAuthStore } from '../../../stores/authStore';

export function serviceItemQueryKey(id: number) {
  return ['admin', 'service-item', id] as const;
}

export function useGetServiceItem(id: number) {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: serviceItemQueryKey(id),
    queryFn: () => {
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      return adminService.getServiceItem(token, id);
    },
    enabled: !!token,
  });
}
