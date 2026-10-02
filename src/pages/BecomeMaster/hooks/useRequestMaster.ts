import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { masterService } from '../../../api/master/masterService';
import type { RequestMasterPayload } from '../../../api/master/requestMaster';
import { useToast } from '../../../components/Toast/toastContext';
import { userDetailsQueryKey } from '../../../hooks/userDetailsQueryKey';
import { useAuthStore } from '../../../stores/authStore';

export function useRequestMaster() {
  const userId = useAuthStore((state) => state.userId);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const location = useLocation();
  const showToast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RequestMasterPayload) => {
      if (!token) {
        throw new Error('Не найден токен авторизации');
      }

      return masterService.requestMaster({ token, payload });
    },
    onSuccess: async () => {
      showToast('success', 'Заявка отправлена');
      await queryClient.invalidateQueries({
        queryKey: userDetailsQueryKey(userId),
      });

      const background = location.state?.background;
      navigate(background?.pathname || '/');
    },
  });
}
