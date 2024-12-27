import { create } from 'zustand';
import { signIn, signUp, signOut } from './auth';
import type { User } from '../types';

interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  signIn: async (email, password) => {
    const user = await signIn(email, password);
    set({ user });
  },
  signUp: async (email, password, fullName) => {
    const user = await signUp(email, password, fullName);
    set({ user });
  },
  signOut: async () => {
    await signOut();
    set({ user: null });
  },
}));