'use client';

import {useEffect, useState} from 'react';
import type {User} from 'firebase/auth';
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  getRedirectResult,
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  setPersistence,
  signInWithEmailLink,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut
} from 'firebase/auth';
import {getFirebaseAuthClient, isFirebaseConfigured} from '@/lib/firebase/client';

const EMAIL_LINK_STORAGE_KEY = 'nwi_auth_email_link';

type UseAuthState = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<{error?: string}>;
  signOut: () => Promise<void>;
};

export function useAuth(): UseAuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuthClient();
    if (!auth) {
      setLoading(false);
      return;
    }

    setPersistence(auth, browserLocalPersistence).catch(() => undefined);

    getRedirectResult(auth).catch(() => undefined);

    if (isSignInWithEmailLink(auth, window.location.href)) {
      const savedEmail = window.localStorage.getItem(EMAIL_LINK_STORAGE_KEY) ?? window.prompt('Enter your email to continue');
      if (savedEmail) {
        signInWithEmailLink(auth, savedEmail, window.location.href)
          .then(() => {
            window.localStorage.removeItem(EMAIL_LINK_STORAGE_KEY);
          })
          .catch(() => undefined);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    signInWithGoogle: async () => {
      const auth = getFirebaseAuthClient();
      if (!auth) {
        return;
      }

      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
      } catch {
        await signInWithRedirect(auth, provider);
      }
    },
    signInWithMagicLink: async (email: string) => {
      const auth = getFirebaseAuthClient();
      if (!auth || !isFirebaseConfigured()) {
        return {error: 'Firebase not configured'};
      }

      try {
        await sendSignInLinkToEmail(auth, email, {
          url: `${window.location.origin}${window.location.pathname}`,
          handleCodeInApp: true
        });
        window.localStorage.setItem(EMAIL_LINK_STORAGE_KEY, email);
        return {};
      } catch (error) {
        return {error: error instanceof Error ? error.message : 'Unable to send magic link'};
      }
    },
    signOut: async () => {
      const auth = getFirebaseAuthClient();
      if (!auth) {
        return;
      }
      await firebaseSignOut(auth);
    }
  };
}
