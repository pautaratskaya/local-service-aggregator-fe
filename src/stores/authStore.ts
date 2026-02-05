import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  phone: string;
  realName: string;
  roles: string[];
  createdAt: string;
}

interface AuthState {
  selectedProfileId: string;
  user: User | null;
  token: string | null;

  setSelectedProfileId: (id: string) => void;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  reset: () => void;
}

const initialState = {
  selectedProfileId: '',
  user: null,
  token: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,
      setSelectedProfileId: (id) => set({ selectedProfileId: id }),
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null, selectedProfileId: '' }),
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
