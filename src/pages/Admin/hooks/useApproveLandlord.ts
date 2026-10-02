import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../../api/admin/adminService';
import { useToast } from '../../../components/Toast/toastContext';
import { useAuthStore } from '../../../stores/authStore';
import { pendingLandlordsQueryKey } from './landlordsQueryKey';

export function useApproveLandlord() {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const showToast = useToast();

  return useMutation({
    mutationFn: (userId: number) => {
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      return adminService.approveLandlord({ token, userId });
    },
    onSuccess: async () => {
      showToast('success', 'Заявка одобрена');
      await queryClient.invalidateQueries({
        queryKey: pendingLandlordsQueryKey,
      });
    },
    onError: (error) => {
      showToast(
        'error',
        error instanceof Error ? error.message : 'Не удалось одобрить заявку'
      );
    },
  });
}
