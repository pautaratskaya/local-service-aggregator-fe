import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { toPremiseFormPayload } from '../../../api/landlord/formData';
import { landlordService } from '../../../api/landlord/landlordService';
import { useToast } from '../../../components/Toast/toastContext';
import { landlordPremisesQueryKey } from '../../../hooks/landlordPremisesQueryKey';
import { useAuthStore } from '../../../stores/authStore';
import type { SubmitLandlordApplicationPayload } from '../../../types/landlord';
import { leaveModal } from '../leaveModal';

export function useUpdatePremise(premiseId: number) {
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

      const premise = toPremiseFormPayload(payload);

      return landlordService.updatePremise({
        token,
        premiseId,
        payload: {
          ...premise,
          photos: premise.photos.length > 0 ? premise.photos : undefined,
        },
      });
    },
    onSuccess: async () => {
      showToast('success', 'Помещение изменено');
      await queryClient.invalidateQueries({
        queryKey: landlordPremisesQueryKey(userId),
      });
      leaveModal(navigate, location);
    },
  });
}
