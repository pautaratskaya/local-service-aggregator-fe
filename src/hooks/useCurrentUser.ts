import { useQuery } from '@tanstack/react-query';
import { authService } from '../api/auth/authService';
import { AuthError } from '../api/auth/types';
import { GET_USER_ERROR_TYPES } from '../api/auth/user';
import { useAuthStore } from '../stores/authStore';
import { userDetailsQueryKey } from './userDetailsQueryKey';

export function isMissingUserError(error: unknown): boolean {
  return (
    error instanceof AuthError && error.type === GET_USER_ERROR_TYPES.NOT_FOUND
  );
}

export function isUnauthorizedUserError(error: unknown): boolean {
  return (
    error instanceof AuthError &&
    error.type === GET_USER_ERROR_TYPES.UNAUTHORIZED
  );
}

export function useCurrentUser() {
  const userId = useAuthStore((state) => state.userId);
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: userDetailsQueryKey(userId),
    queryFn: () => {
      if (userId == null || !token) {
        throw new Error('User id is required');
      }

      return authService.getUser({ userId, token });
    },
    enabled: userId != null && !!token,
    retry: (failureCount, error) => {
      if (isUnauthorizedUserError(error) || isMissingUserError(error)) {
        return false;
      }

      return failureCount < 3;
    },
  });
}
