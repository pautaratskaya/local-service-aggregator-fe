import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../../api/admin/adminService';
import type { AdminServiceItemPayload } from '../../../api/admin/serviceItem';
import { useToast } from '../../../components/Toast/toastContext';
import { useAuthStore } from '../../../stores/authStore';
import { catalogTreeQueryKey } from './useCatalogTree';

export type CreateServiceItemVariables = {
  workspaceTypeId: number;
  payload: AdminServiceItemPayload;
};

export function useCreateServiceItem() {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const showToast = useToast();

  return useMutation({
    mutationFn: ({ workspaceTypeId, payload }: CreateServiceItemVariables) => {
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      return adminService.createServiceItem(token, workspaceTypeId, payload);
    },
    onSuccess: async () => {
      showToast('success', 'Услуга добавлена');
      await queryClient.invalidateQueries({ queryKey: catalogTreeQueryKey });
    },
    onError: (error) => {
      showToast(
        'error',
        error instanceof Error ? error.message : 'Не удалось добавить услугу',
      );
    },
  });
}
