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
  credits: {
    free: number;
    bonus: number;
    total: number;
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
  updateCredits: (credits: { free: number; bonus: number; total: number }) => void;
  deductCredit: () => boolean;
  getTotalCredits: () => number;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      userProfile: null,
      loading: true,
      setUser: (user) => set({ user }),
      setUserProfile: (profile) => set({ userProfile: profile }),
      setLoading: (loading) => set({ loading }),
      updateCredits: (credits) => {
        const { userProfile } = get();
        if (userProfile) {
          set({
            userProfile: {
              ...userProfile,
              credits: credits
            }
          });
        }
      },
      deductCredit: () => {
        const { userProfile } = get();
        if (!userProfile) return false;

        // First use free credits, then bonus credits, then paid subscription credits
        if (userProfile.credits.free > 0) {
          const newCredits = {
            ...userProfile.credits,
            free: userProfile.credits.free - 1,
            total: userProfile.credits.total - 1
          };
          set({
            userProfile: {
              ...userProfile,
              credits: newCredits
            }
          });
          return true;
        } else if (userProfile.credits.bonus > 0) {
          const newCredits = {
            ...userProfile.credits,
            bonus: userProfile.credits.bonus - 1,
            total: userProfile.credits.total - 1
          };
          set({
            userProfile: {
              ...userProfile,
              credits: newCredits
            }
          });
          return true;
        } else if (userProfile.subscription.videosRemaining > 0) {
          set({
            userProfile: {
              ...userProfile,
              subscription: {
                ...userProfile.subscription,
                videosRemaining: userProfile.subscription.videosRemaining - 1
              },
              credits: {
                ...userProfile.credits,
                total: userProfile.credits.total - 1
              }
            }
          });
          return true;
        }
        return false; // No credits available
      },
      getTotalCredits: () => {
        const { userProfile } = get();
        if (!userProfile) return 0;
        return userProfile.credits.free + userProfile.credits.bonus + userProfile.subscription.videosRemaining;
      },
      logout: () => set({ user: null, userProfile: null }),
    }),
    {
      name: 'medspagen-auth',
      partialize: (state) => ({ userProfile: state.userProfile }),
    }
  )
);