import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../../api/admin/adminService';
import type { CatalogGroup } from '../../../api/catalog/getCatalogTree';
import { useToast } from '../../../components/Toast/toastContext';
import { useAuthStore } from '../../../stores/authStore';
import { catalogTreeQueryKey } from './useCatalogTree';
import { serviceGroupQueryKey } from './useGetServiceGroup';

export function useDeleteServiceGroup() {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const showToast = useToast();

  return useMutation({
    mutationFn: (id: number) => {
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      return adminService.deleteServiceGroup(token, id);
    },
    onSuccess: (_data, id) => {
      showToast('success', 'Группа удалена');
      queryClient.setQueryData<CatalogGroup[]>(catalogTreeQueryKey, (current) =>
        current?.filter((group) => group.id !== id),
      );
      queryClient.removeQueries({ queryKey: serviceGroupQueryKey(id) });
    },
    onError: (error) => {
      showToast(
        'error',
        error instanceof Error ? error.message : 'Не удалось удалить группу',
      );
    },
  });
}
