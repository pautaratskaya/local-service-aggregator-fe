import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type User, type UserRole } from '../types/user';

interface AuthState {
  selectedRole: UserRole | null;
  user: User | null;
  token: string | null;

  setSelectedRole: (role: UserRole) => void;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  reset: () => void;
}

const initialState = {
  selectedRole: null,
  user: null,
  token: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,
      setSelectedRole: (role) => set({ selectedRole: role }),
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null, selectedRole: null }),
      reset: () => set(initialState),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
