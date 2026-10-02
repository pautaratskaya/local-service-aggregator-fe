import { useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userDetailsQueryKey } from '../hooks/userDetailsQueryKey';
import { queryClient } from '../providers/QueryProvider';
import { USER_ROLES, type UserRole } from '../types/user';

interface AuthState {
  selectedRole: UserRole | null;
  userId: number | null;
  token: string | null;

  setSelectedRole: (role: UserRole) => void;
  setAuth: (userId: number, token: string) => Promise<void>;
  logout: () => void;
  reset: () => void;
}

const initialState = {
  selectedRole: null,
  userId: null,
  token: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,
      setSelectedRole: (role) => set({ selectedRole: role }),
      setAuth: async (userId, token) => {
        set({ userId, token, selectedRole: USER_ROLES.CUSTOMER });
        await queryClient.invalidateQueries({
          queryKey: userDetailsQueryKey(userId),
        });
      },
      logout: () => set({ userId: null, token: null, selectedRole: null }),
      reset: () => set(initialState),
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
