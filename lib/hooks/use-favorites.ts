'use client';

import useSWR from 'swr';
import {useAuth} from '@/lib/hooks/use-auth';
import {getFirebaseFirestoreClient, isFirebaseConfigured} from '@/lib/firebase/client';
import {collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc, Timestamp} from 'firebase/firestore';

type FavoriteRow = {
  iso2: string;
  created_at: string;
  note?: string | null;
};

function toIsoString(value: unknown) {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'string') {
    return value;
  }
  return new Date(0).toISOString();
}

async function fetchFavoritesByUserId(userId: string): Promise<FavoriteRow[]> {
  const db = getFirebaseFirestoreClient();
  if (!db) {
    return [];
  }

  const favoritesRef = collection(db, 'users', userId, 'favorites');
  const snapshot = await getDocs(favoritesRef);

  return snapshot.docs
    .map((item) => {
      const data = item.data() as {iso2?: string; created_at?: unknown; note?: string | null};
      return {
        iso2: (data.iso2 ?? item.id).toUpperCase(),
        created_at: toIsoString(data.created_at),
        note: data.note ?? null
      } satisfies FavoriteRow;
    })
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function useFavorites() {
  const {user} = useAuth();
  const userId = user?.uid;

  const {data, error, isLoading, mutate} = useSWR<FavoriteRow[]>(
    userId ? ['firebase-favorites', userId] : null,
    (_key: readonly [string, string]) => fetchFavoritesByUserId(_key[1])
  );

  const list = data ?? [];

  return {
    favorites: list,
    favoriteSet: new Set(list.map((item) => item.iso2)),
    isLoading,
    error: error ? String(error) : null,
    isEnabled: Boolean(user && isFirebaseConfigured()),
    toggleFavorite: async (iso2: string) => {
      if (!userId) {
        throw new Error('Login required');
      }

      const db = getFirebaseFirestoreClient();
      if (!db) {
        throw new Error('Firebase not configured');
      }

      const normalized = iso2.toUpperCase();
      const exists = list.some((item) => item.iso2 === normalized);
      const favoriteDocRef = doc(db, 'users', userId, 'favorites', normalized);

      if (exists) {
        await deleteDoc(favoriteDocRef);
      } else {
        await setDoc(
          favoriteDocRef,
          {
            iso2: normalized,
            created_at: serverTimestamp(),
            note: null
          },
          {merge: true}
        );
      }

      await mutate();
    },
    refresh: mutate
  };
}
