import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../../api/admin/adminService';
import { useToast } from '../../../components/Toast/toastContext';
import { useAuthStore } from '../../../stores/authStore';
import { pendingMastersQueryKey } from './mastersQueryKey';

export function useApproveMaster() {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const showToast = useToast();

  return useMutation({
    mutationFn: (userId: number) => {
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      return adminService.approveMaster({ token, userId });
    },
    onSuccess: async () => {
      showToast('success', 'Заявка одобрена');
      await queryClient.invalidateQueries({
        queryKey: pendingMastersQueryKey,
      });
    },
    onError: (error) => {
      showToast(
        'error',
        error instanceof Error ? error.message : 'Не удалось одобрить заявку',
      );
    },
  });
}
