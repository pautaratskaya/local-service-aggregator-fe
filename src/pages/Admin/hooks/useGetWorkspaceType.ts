import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../../api/admin/adminService';
import { useAuthStore } from '../../../stores/authStore';

export function workspaceTypeQueryKey(id: number) {
  return ['admin', 'workspace-type', id] as const;
}

export function useGetWorkspaceType(id: number) {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: workspaceTypeQueryKey(id),
    queryFn: () => {
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      return adminService.getWorkspaceType(token, id);
    },
    enabled: !!token,
  });
}
