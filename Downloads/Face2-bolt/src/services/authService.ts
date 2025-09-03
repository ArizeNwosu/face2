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
    createdAt: new Date(),
  };

  await setDoc(doc(db, 'users', user.uid), userProfile);
  return userProfile;
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
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