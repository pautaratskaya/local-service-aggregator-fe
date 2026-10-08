import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../../api/admin/adminService';
import type { AdminServiceGroupPayload } from '../../../api/admin/serviceGroup';
import type { CatalogGroup } from '../../../api/catalog/getCatalogTree';
import { useToast } from '../../../components/Toast/toastContext';
import { useAuthStore } from '../../../stores/authStore';
import { catalogTreeQueryKey } from './useCatalogTree';
import { serviceGroupQueryKey } from './useGetServiceGroup';

export type UpdateServiceGroupVariables = {
  id: number;
  payload: AdminServiceGroupPayload;
};

export function useUpdateServiceGroup() {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const showToast = useToast();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateServiceGroupVariables) => {
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      return adminService.updateServiceGroup(token, id, payload);
    },
    onSuccess: (updated, { id }) => {
      showToast('success', 'Группа сохранена');
      queryClient.setQueryData<CatalogGroup[]>(catalogTreeQueryKey, (current) =>
        current?.map((group) =>
          group.id === id
            ? {
                ...group,
                name: updated.name,
                description: updated.description,
              }
            : group,
        ),
      );
      queryClient.setQueryData(serviceGroupQueryKey(id), updated);
    },
    onError: (error) => {
      showToast(
        'error',
        error instanceof Error ? error.message : 'Не удалось сохранить группу',
      );
    },
  });
}
