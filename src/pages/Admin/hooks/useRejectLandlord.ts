import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../../api/admin/adminService';
import { useToast } from '../../../components/Toast/toastContext';
import { useAuthStore } from '../../../stores/authStore';
import { pendingLandlordsQueryKey } from './landlordsQueryKey';

export type RejectLandlordVariables = {
  userId: number;
  reason?: string;
};

export function useRejectLandlord() {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const showToast = useToast();

  return useMutation({
    mutationFn: ({ userId, reason }: RejectLandlordVariables) => {
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      return adminService.rejectLandlord({ token, userId, reason });
    },
    onSuccess: async () => {
      showToast('success', 'Заявка отклонена');
      await queryClient.invalidateQueries({
        queryKey: pendingLandlordsQueryKey,
      });
    },
    onError: (error) => {
      showToast(
        'error',
        error instanceof Error ? error.message : 'Не удалось отклонить заявку'
      );
    },
  });
}
