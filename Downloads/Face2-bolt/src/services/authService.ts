import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { UserProfile } from '../store/authStore';

export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update the user's display name
    await updateProfile(user, { displayName });

    // Create user profile in Firestore
    await createUserProfile(user, displayName);

    return user;
  } catch (error) {
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user profile exists, if not create one
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await createUserProfile(user, user.displayName || '');
    }

    return user;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const createUserProfile = async (user: User, displayName: string) => {
  const userProfile: UserProfile = {
    uid: user.uid,
    email: user.email || '',
    displayName: displayName || user.displayName,
    photoURL: user.photoURL,
    subscription: {
      plan: 'free',
      status: 'active',
      videosRemaining: 2, // Free tier gets 2 videos
      videosTotal: 2,
    },
    credits: {
      free: 3, // Give every new user 3 free video credits
      bonus: 0, // Additional bonus credits (for promotions, etc.)
      total: 5, // 3 free credits + 2 subscription credits
    },
    createdAt: new Date(),
  };

  await setDoc(doc(db, 'users', user.uid), userProfile);
  return userProfile;
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const userData = userDoc.data() as UserProfile;
      
      // Migration: Add credits field if it doesn't exist (for existing users)
      if (!userData.credits) {
        const migratedProfile: UserProfile = {
          ...userData,
          credits: {
            free: 3, // Give existing users 3 free credits too
            bonus: 0,
            total: 3 + (userData.subscription?.videosRemaining || 0),
          },
        };
        
        // Update the user profile with credits
        await setDoc(doc(db, 'users', uid), migratedProfile);
        return migratedProfile;
      }
      
      return userData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserSubscription = async (
  uid: string,
  subscription: UserProfile['subscription']
) => {
  try {
    await setDoc(
      doc(db, 'users', uid),
      { subscription },
      { merge: true }
    );
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

export const updateUserCredits = async (
  uid: string,
  credits: UserProfile['credits'],
  subscription?: UserProfile['subscription']
) => {
  try {
    const updateData: any = { credits };
    if (subscription) {
      updateData.subscription = subscription;
    }
    
    await setDoc(
      doc(db, 'users', uid),
      updateData,
      { merge: true }
    );
  } catch (error) {
    console.error('Error updating user credits:', error);
    throw error;
  }
};

export const deductUserCredit = async (uid: string): Promise<boolean> => {
  try {
    const userProfile = await getUserProfile(uid);
    if (!userProfile) return false;

    // First use free credits, then bonus credits, then paid subscription credits
    if (userProfile.credits.free > 0) {
      const newCredits = {
        ...userProfile.credits,
        free: userProfile.credits.free - 1,
        total: userProfile.credits.total - 1
      };
      await updateUserCredits(uid, newCredits);
      return true;
    } else if (userProfile.credits.bonus > 0) {
      const newCredits = {
        ...userProfile.credits,
        bonus: userProfile.credits.bonus - 1,
        total: userProfile.credits.total - 1
      };
      await updateUserCredits(uid, newCredits);
      return true;
    } else if (userProfile.subscription.videosRemaining > 0) {
      const newSubscription = {
        ...userProfile.subscription,
        videosRemaining: userProfile.subscription.videosRemaining - 1
      };
      const newCredits = {
        ...userProfile.credits,
        total: userProfile.credits.total - 1
      };
      await updateUserCredits(uid, newCredits, newSubscription);
      return true;
    }
    
    return false; // No credits available
  } catch (error) {
    console.error('Error deducting user credit:', error);
    return false;
  }
};