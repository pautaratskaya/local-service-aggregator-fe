import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../../api/admin/adminService';
import { useAuthStore } from '../../../stores/authStore';

export function serviceGroupQueryKey(id: number) {
  return ['admin', 'service-group', id] as const;
}

export function useGetServiceGroup(id: number) {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: serviceGroupQueryKey(id),
    queryFn: () => {
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      return adminService.getServiceGroup(token, id);
    },
    enabled: !!token,
  });
}
