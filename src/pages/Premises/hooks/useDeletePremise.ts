import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { landlordService } from '../../../api/landlord/landlordService';
import { useToast } from '../../../components/Toast/toastContext';
import { landlordPremisesQueryKey } from '../../../hooks/landlordPremisesQueryKey';
import { userDetailsQueryKey } from '../../../hooks/userDetailsQueryKey';
import { useAuthStore } from '../../../stores/authStore';

type DeletePremiseVariables = {
  premiseId: number;
  wasLast: boolean;
};

export function useDeletePremise() {
  const userId = useAuthStore((state) => state.userId);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const showToast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ premiseId }: DeletePremiseVariables) => {
      if (!token) {
        throw new Error('Не найден токен авторизации');
      }

      return landlordService.deletePremise({ token, premiseId });
    },
    onSuccess: async (_result, { wasLast }) => {
      showToast('success', 'Помещение удалено');
      await queryClient.invalidateQueries({
        queryKey: landlordPremisesQueryKey(userId),
      });
      await queryClient.invalidateQueries({
        queryKey: userDetailsQueryKey(userId),
      });

      if (wasLast) {
        navigate('/', { replace: true });
      }
    },
  });
}
