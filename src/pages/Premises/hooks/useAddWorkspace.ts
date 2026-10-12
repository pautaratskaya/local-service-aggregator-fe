import type { WorkspaceFormPayload } from '../../../api/landlord/formData';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { landlordService } from '../../../api/landlord/landlordService';
import { useToast } from '../../../components/Toast/toastContext';
import { landlordPremisesQueryKey } from '../../../hooks/landlordPremisesQueryKey';
import { useAuthStore } from '../../../stores/authStore';
import { leaveModal } from '../leaveModal';

export function useAddWorkspace(premiseId: number) {
  const userId = useAuthStore((state) => state.userId);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const location = useLocation();
  const showToast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WorkspaceFormPayload & { photos: File[] }) => {
      if (!token) {
        throw new Error('Не найден токен авторизации');
      }

      return landlordService.addWorkspace({ token, premiseId, payload });
    },
    onSuccess: async () => {
      showToast('success', 'Рабочее место добавлено');
      await queryClient.invalidateQueries({
        queryKey: landlordPremisesQueryKey(userId),
      });
      leaveModal(navigate, location);
    },
  });
}
