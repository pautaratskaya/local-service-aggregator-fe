import { useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userDetailsQueryKey } from '../hooks/userDetailsQueryKey';
import { queryClient } from '../providers/queryClient';
import { USER_ROLES, type UserRole } from '../types/user';

interface AuthState {
  selectedRole: UserRole | null;
  userId: number | null;
  token: string | null;
  sessionExpired: boolean;

  setSelectedRole: (role: UserRole) => void;
  setAuth: (userId: number, token: string) => Promise<void>;
  expireSession: () => void;
  logout: () => void;
}

const initialState = {
  selectedRole: null,
  userId: null,
  token: null,
  sessionExpired: false,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,
      setSelectedRole: (role) => set({ selectedRole: role }),
      setAuth: async (userId, token) => {
        set({
          userId,
          token,
          selectedRole: USER_ROLES.CUSTOMER,
          sessionExpired: false,
        });
        await queryClient.invalidateQueries({
          queryKey: userDetailsQueryKey(userId),
        });
      },
      // A 401 that arrives after logout must not show the expired screen.
      expireSession: () =>
        set((state) => (state.token ? { sessionExpired: true } : {})),
      logout: () => {
        set({
          userId: null,
          token: null,
          selectedRole: null,
          sessionExpired: false,
        });
        queryClient.clear();
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        userId: state.userId,
        token: state.token, // TODO: remove
        selectedRole: state.selectedRole,
      }),
    }
  )
);

export function useAuthHydrated() {
  return useSyncExternalStore(
    (onStoreChange) => useAuthStore.persist.onFinishHydration(onStoreChange),
    () => useAuthStore.persist.hasHydrated(),
    () => false
  );
}
