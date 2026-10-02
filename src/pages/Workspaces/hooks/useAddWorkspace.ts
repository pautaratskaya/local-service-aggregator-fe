import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { landlordService } from '../../../api/landlord/landlordService';
import { useToast } from '../../../components/Toast/toastContext';
import { landlordWorkspacesQueryKey } from '../../../hooks/landlordWorkspacesQueryKey';
import { useAuthStore } from '../../../stores/authStore';
import type { SubmitLandlordApplicationPayload } from '../../../types/landlord';

export function useAddWorkspace() {
  const userId = useAuthStore((state) => state.userId);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const location = useLocation();
  const showToast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitLandlordApplicationPayload) => {
      if (!token) {
        throw new Error('Не найден токен авторизации');
      }

      return landlordService.addWorkspace({ token, payload });
    },
    onSuccess: async () => {
      showToast('success', 'Рабочее место добавлено');
      await queryClient.invalidateQueries({
        queryKey: landlordWorkspacesQueryKey(userId),
      });

      const background = location.state?.background;
      navigate(background?.pathname || '/workspaces');
    },
  });
}
