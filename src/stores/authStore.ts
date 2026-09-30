import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { queryClient } from '../providers/QueryProvider';
import { type UserRole } from '../types/user';

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
        set({ userId, token });
        await queryClient.invalidateQueries({
          queryKey: ['user-details', userId],
        });
      },
      logout: () => set({ userId: null, token: null, selectedRole: null }),
      reset: () => set(initialState),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        userId: state.userId, // TODO: add selectedRole? or remove all?
        token: state.token, // TODO: remove
      }),
    }
  )
);
