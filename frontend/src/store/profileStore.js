import { create } from 'zustand';

export const useProfileStore = create((set) => ({
  profile: null,
  loading: true,
  setProfile: (profile) => set({ profile, loading: false }),
  setLoading: (loading) => set({ loading }),
}));
