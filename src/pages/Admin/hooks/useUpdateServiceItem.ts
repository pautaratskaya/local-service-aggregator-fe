import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../../api/admin/adminService';
import type { AdminServiceItemPayload } from '../../../api/admin/serviceItem';
import type { CatalogGroup } from '../../../api/catalog/getCatalogTree';
import { useToast } from '../../../components/Toast/toastContext';
import { useAuthStore } from '../../../stores/authStore';
import { catalogTreeQueryKey } from './useCatalogTree';
import { serviceItemQueryKey } from './useGetServiceItem';

export type UpdateServiceItemVariables = {
  id: number;
  payload: AdminServiceItemPayload;
};

export function useUpdateServiceItem() {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const showToast = useToast();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateServiceItemVariables) => {
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      return adminService.updateServiceItem(token, id, payload);
    },
    onSuccess: (updated, { id }) => {
      showToast('success', 'Услуга сохранена');
      queryClient.setQueryData<CatalogGroup[]>(catalogTreeQueryKey, (current) =>
        current?.map((group) => ({
          ...group,
          workspaceTypes: group.workspaceTypes.map((workspaceType) => ({
            ...workspaceType,
            services: workspaceType.services.map((service) =>
              service.id === id
                ? {
                    ...service,
                    name: updated.name,
                    description: updated.description ?? '',
                    durationMinutes: updated.durationMinutes,
                  }
                : service,
            ),
          })),
        })),
      );
      queryClient.setQueryData(serviceItemQueryKey(id), updated);
    },
    onError: (error) => {
      showToast(
        'error',
        error instanceof Error ? error.message : 'Не удалось сохранить услугу',
      );
    },
  });
}
