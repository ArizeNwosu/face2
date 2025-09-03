import { create } from 'zustand';
import { User } from 'firebase/auth';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  subscription: {
    plan: 'free' | 'starter' | 'pro' | 'enterprise';
    status: 'active' | 'inactive' | 'cancelled';
    videosRemaining: number;
    videosTotal: number;
    renewalDate?: Date;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    cancelDate?: Date;
    createdAt?: Date;
  };
  createdAt: Date;
}

interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      userProfile: null,
      loading: true,
      setUser: (user) => set({ user }),
      setUserProfile: (profile) => set({ userProfile: profile }),
      setLoading: (loading) => set({ loading }),
      logout: () => set({ user: null, userProfile: null }),
    }),
    {
      name: 'medspagen-auth',
      partialize: (state) => ({ userProfile: state.userProfile }),
    }
  )
);