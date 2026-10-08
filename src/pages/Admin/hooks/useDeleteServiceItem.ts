import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../../api/admin/adminService';
import { useToast } from '../../../components/Toast/toastContext';
import { useAuthStore } from '../../../stores/authStore';
import { catalogTreeQueryKey } from './useCatalogTree';
import { serviceItemQueryKey } from './useGetServiceItem';

export function useDeleteServiceItem() {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const showToast = useToast();

  return useMutation({
    mutationFn: (id: number) => {
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      return adminService.deleteServiceItem(token, id);
    },
    onSuccess: async (_data, id) => {
      showToast('success', 'Услуга удалена');
      await queryClient.invalidateQueries({ queryKey: catalogTreeQueryKey });
      queryClient.removeQueries({ queryKey: serviceItemQueryKey(id) });
    },
    onError: (error) => {
      showToast(
        'error',
        error instanceof Error ? error.message : 'Не удалось удалить услугу',
      );
    },
  });
}
