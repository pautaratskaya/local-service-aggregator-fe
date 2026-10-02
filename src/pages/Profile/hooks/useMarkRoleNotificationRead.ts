import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../../api/auth/authService';
import type { RoleNotificationKind } from '../../../api/auth/markRoleNotificationRead';
import { useToast } from '../../../components/Toast/toastContext';
import { userDetailsQueryKey } from '../../../hooks/userDetailsQueryKey';
import { useAuthStore } from '../../../stores/authStore';
import type { User } from '../../../types/user';

export function useMarkRoleNotificationRead() {
  const userId = useAuthStore((state) => state.userId);
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const showToast = useToast();

  const commitReadUser = useCallback(
    (user: User) => {
      queryClient.setQueryData(userDetailsQueryKey(userId), user);
    },
    [queryClient, userId],
  );

  const mutation = useMutation({
    mutationFn: (kind: RoleNotificationKind) => {
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      return authService.markRoleNotificationRead({ token, kind });
    },
    onError: (error) => {
      showToast(
        'error',
        error instanceof Error
          ? error.message
          : 'Не удалось отметить уведомление прочитанным',
      );
    },
  });

  return { ...mutation, commitReadUser };
}
