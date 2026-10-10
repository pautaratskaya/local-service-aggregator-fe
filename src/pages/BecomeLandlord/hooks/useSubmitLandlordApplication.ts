import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { landlordService } from '../../../api/landlord/landlordService';
import { useToast } from '../../../components/Toast/toastContext';
import { userDetailsQueryKey } from '../../../hooks/userDetailsQueryKey';
import { useAuthStore } from '../../../stores/authStore';
import type { SubmitLandlordApplicationPayload } from '../../../types/landlord';

export function useSubmitLandlordApplication() {
  const userId = useAuthStore((state) => state.userId);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const location = useLocation();
  const showToast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitLandlordApplicationPayload) => {
      if (!userId) {
        throw new Error('Требуется авторизация');
      }
      if (!token) {
        throw new Error('Не найден токен авторизации');
      }

      return landlordService.submitApplication({ token, payload });
    },
    onSuccess: async () => {
      showToast('success', 'Заявка отправлена');
      const background = location.state?.background;
      navigate(
        background ? `${background.pathname}${background.search}` : '/',
        { replace: true },
      );
      await queryClient.invalidateQueries({
        queryKey: userDetailsQueryKey(userId),
      });
    },
  });
}
