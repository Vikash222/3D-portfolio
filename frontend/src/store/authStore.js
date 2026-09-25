import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      admin: null,
      isAuthenticated: false,
      setAuth: (token, admin) => set({ token, admin, isAuthenticated: true }),
      logout: () => set({ token: null, admin: null, isAuthenticated: false }),
    }),
    { name: 'admin-auth' }
  )
);
