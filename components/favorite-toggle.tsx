'use client';

import {Heart} from 'lucide-react';
import {cn} from '@/lib/utils/cn';
import {useFavorites} from '@/lib/hooks/use-favorites';

export function FavoriteToggle({iso2}: {iso2: string}) {
  const {favoriteSet, toggleFavorite, isEnabled} = useFavorites();
  const active = favoriteSet.has(iso2);

  return (
    <button
      type="button"
      aria-label="Toggle favorite"
      onClick={async () => {
        if (!isEnabled) {
          window.alert('Please log in to use favorites.');
          return;
        }
        await toggleFavorite(iso2);
      }}
      className={cn(
        'rounded-full border p-2 transition',
        active
          ? 'border-rose-400/70 bg-rose-500/20 text-rose-200'
          : 'border-nwi-border bg-[#0c1623] text-nwi-muted hover:text-rose-200'
      )}
    >
      <Heart className={cn('h-4 w-4', active ? 'fill-rose-300' : '')} />
    </button>
  );
}
