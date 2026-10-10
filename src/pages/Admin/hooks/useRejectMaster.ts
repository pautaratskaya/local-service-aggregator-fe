import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../../api/admin/adminService';
import { useToast } from '../../../components/Toast/toastContext';
import { useAuthStore } from '../../../stores/authStore';
import { pendingMastersQueryKey } from './mastersQueryKey';

export type RejectMasterVariables = {
  userId: number;
  reason?: string;
};

export function useRejectMaster() {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const showToast = useToast();

  return useMutation({
    mutationFn: ({ userId, reason }: RejectMasterVariables) => {
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      return adminService.rejectMaster({ token, userId, reason });
    },
    onSuccess: async () => {
      showToast('success', 'Заявка отклонена');
      await queryClient.invalidateQueries({
        queryKey: pendingMastersQueryKey,
      });
    },
    onError: (error) => {
      showToast(
        'error',
        error instanceof Error ? error.message : 'Не удалось отклонить заявку',
      );
    },
  });
}
