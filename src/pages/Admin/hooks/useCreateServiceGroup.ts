import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../../api/admin/adminService';
import type { AdminServiceGroupPayload } from '../../../api/admin/serviceGroup';
import type { CatalogGroup } from '../../../api/catalog/getCatalogTree';
import { useToast } from '../../../components/Toast/toastContext';
import { useAuthStore } from '../../../stores/authStore';
import { catalogTreeQueryKey } from './useCatalogTree';
import { serviceGroupQueryKey } from './useGetServiceGroup';

export function useCreateServiceGroup() {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const showToast = useToast();

  return useMutation({
    mutationFn: (payload: AdminServiceGroupPayload) => {
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      return adminService.createServiceGroup(token, payload);
    },
    onSuccess: (created) => {
      showToast('success', 'Группа добавлена');
      queryClient.setQueryData(serviceGroupQueryKey(created.id), created);
      queryClient.setQueryData<CatalogGroup[]>(catalogTreeQueryKey, (current) =>
        current
          ? [...current, { ...created, workspaceTypes: [] }]
          : [{ ...created, workspaceTypes: [] }],
      );
    },
    onError: (error) => {
      showToast(
        'error',
        error instanceof Error ? error.message : 'Не удалось добавить группу',
      );
    },
  });
}
