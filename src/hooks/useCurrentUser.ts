import { useQuery } from '@tanstack/react-query';
import { authService } from '../api/auth/authService';
import { AuthError } from '../api/auth/types';
import { GET_USER_ERROR_TYPES } from '../api/auth/user';
import { useAuthStore } from '../stores/authStore';

export function isMissingUserError(error: unknown): boolean {
  return (
    error instanceof AuthError && error.type === GET_USER_ERROR_TYPES.NOT_FOUND
  );
}

export function useCurrentUser() {
  const userId = useAuthStore((state) => state.userId);

  return useQuery({
    queryKey: ['user-details', userId],
    queryFn: () => {
      if (userId == null) {
        throw new Error('User id is required');
      }

      return authService.getUser({ userId });
    },
    enabled: userId != null,
  });
}
