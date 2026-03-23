'use client';

import useSWR from 'swr';
import {useMemo} from 'react';
import {useAuth} from '@/lib/hooks/use-auth';

type FavoriteRow = {
  iso2: string;
  created_at: string;
  note?: string | null;
};

async function apiFetch<T>(url: string, token: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {})
    }
  });

  const data = (await response.json()) as T & {error?: string};
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export function useFavorites() {
  const {session, user} = useAuth();
  const token = session?.access_token;

  const key = useMemo<readonly [string, string] | null>(
    () => (token ? ['/api/favorites', token] as const : null),
    [token]
  );

  const {data, error, isLoading, mutate} = useSWR<{data: FavoriteRow[]}>(
    key,
    ([url, authToken]: readonly [string, string]) => apiFetch<{data: FavoriteRow[]}>(url, authToken)
  );

  const list = data?.data ?? [];

  return {
    favorites: list,
    favoriteSet: new Set(list.map((item) => item.iso2)),
    isLoading,
    error: error ? String(error) : null,
    isEnabled: Boolean(user && token),
    toggleFavorite: async (iso2: string) => {
      if (!token) {
        throw new Error('Login required');
      }

      const exists = list.some((item) => item.iso2 === iso2);
      if (exists) {
        await apiFetch(`/api/favorites/${iso2}`, token, {method: 'DELETE'});
      } else {
        await apiFetch('/api/favorites', token, {
          method: 'POST',
          body: JSON.stringify({iso2})
        });
      }

      await mutate();
    },
    refresh: mutate
  };
}
