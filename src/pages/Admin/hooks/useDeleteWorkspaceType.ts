import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../../api/admin/adminService';
import type { CatalogGroup } from '../../../api/catalog/getCatalogTree';
import { useToast } from '../../../components/Toast/toastContext';
import { useAuthStore } from '../../../stores/authStore';
import { catalogTreeQueryKey } from './useCatalogTree';
import { workspaceTypeQueryKey } from './useGetWorkspaceType';

export function useDeleteWorkspaceType() {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const showToast = useToast();

  return useMutation({
    mutationFn: (id: number) => {
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      return adminService.deleteWorkspaceType(token, id);
    },
    onSuccess: (_data, id) => {
      showToast('success', 'Тип помещения удалён');
      queryClient.setQueryData<CatalogGroup[]>(catalogTreeQueryKey, (current) =>
        current?.map((group) => ({
          ...group,
          workspaceTypes: group.workspaceTypes.filter(
            (workspaceType) => workspaceType.id !== id,
          ),
        })),
      );
      queryClient.removeQueries({ queryKey: workspaceTypeQueryKey(id) });
    },
    onError: (error) => {
      showToast(
        'error',
        error instanceof Error
          ? error.message
          : 'Не удалось удалить тип помещения',
      );
    },
  });
}
