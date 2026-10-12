import { useMutation, useQueryClient } from '@tanstack/react-query';
import { landlordService } from '../../../api/landlord/landlordService';
import { useToast } from '../../../components/Toast/toastContext';
import { landlordPremisesQueryKey } from '../../../hooks/landlordPremisesQueryKey';
import { useAuthStore } from '../../../stores/authStore';

export function useDeleteWorkspace() {
  const userId = useAuthStore((state) => state.userId);
  const token = useAuthStore((state) => state.token);
  const showToast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workspaceId: number) => {
      if (!token) {
        throw new Error('Не найден токен авторизации');
      }

      return landlordService.deleteWorkspace({ token, workspaceId });
    },
    onSuccess: async () => {
      showToast('success', 'Рабочее место удалено');
      await queryClient.invalidateQueries({
        queryKey: landlordPremisesQueryKey(userId),
      });
    },
  });
}
