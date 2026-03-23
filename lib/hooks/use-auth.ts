'use client';

import {useEffect, useMemo, useState} from 'react';
import type {Session, User} from '@supabase/supabase-js';
import {getSupabaseBrowserClient} from '@/lib/supabase/browser';

type UseAuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<{error?: string}>;
  signOut: () => Promise<void>;
};

export function useAuth(): UseAuthState {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth
      .getSession()
      .then(({data}) => {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      })
      .finally(() => setLoading(false));

    const {
      data: {subscription}
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return {
    user,
    session,
    loading,
    signInWithGoogle: async () => {
      if (!supabase) {
        return;
      }
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${window.location.pathname}`
        }
      });
    },
    signInWithMagicLink: async (email: string) => {
      if (!supabase) {
        return {error: 'Supabase not configured'};
      }

      const {error} = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}${window.location.pathname}`
        }
      });

      return error ? {error: error.message} : {};
    },
    signOut: async () => {
      if (!supabase) {
        return;
      }
      await supabase.auth.signOut();
    }
  };
}
