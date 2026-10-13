import type { WorkspaceFormPayload } from '../../../api/landlord/formData';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { landlordService } from '../../../api/landlord/landlordService';
import { useToast } from '../../../components/Toast/toastContext';
import { landlordPremisesQueryKey } from '../../../hooks/landlordPremisesQueryKey';
import { useAuthStore } from '../../../stores/authStore';
import { leaveModal } from '../leaveModal';

export function useUpdateWorkspace(workspaceId: number) {
  const userId = useAuthStore((state) => state.userId);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const location = useLocation();
  const showToast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: WorkspaceFormPayload) => {
      if (!token) {
        throw new Error('Не найден токен авторизации');
      }

      const { serviceItemIds, ...workspace } = payload;
      const updated = await landlordService.updateWorkspace({
        token,
        workspaceId,
        payload: workspace,
      });

      try {
        await landlordService.replaceWorkspaceServices({
          token,
          workspaceId,
          serviceItemIds: serviceItemIds ?? [],
        });
      } catch {
        // The workspace itself is already saved: show it in the list.
        await queryClient.invalidateQueries({
          queryKey: landlordPremisesQueryKey(userId),
        });
        throw new Error(
          'Данные рабочего места сохранены, но услуги обновить не удалось. Попробуйте ещё раз',
        );
      }

      return updated;
    },
    onSuccess: async () => {
      showToast('success', 'Рабочее место изменено');
      await queryClient.invalidateQueries({
        queryKey: landlordPremisesQueryKey(userId),
      });
      leaveModal(navigate, location);
    },
  });
}
