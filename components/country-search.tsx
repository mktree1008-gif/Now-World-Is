'use client';

import {useMemo, useState} from 'react';
import {Search} from 'lucide-react';
import Image from 'next/image';
import type {CountrySummary} from '@/lib/types';
import {cn} from '@/lib/utils/cn';

export function CountrySearch({
  countries,
  placeholder,
  onPick
}: {
  countries: CountrySummary[];
  placeholder: string;
  onPick: (country: CountrySummary) => void;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const candidates = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return countries.slice(0, 8);
    }

    return countries
      .filter((country) => {
        return (
          country.localizedName.toLowerCase().includes(q) ||
          country.englishName.toLowerCase().includes(q) ||
          country.iso2.toLowerCase().includes(q) ||
          country.region.toLowerCase().includes(q)
        );
      })
      .slice(0, 8);
  }, [countries, query]);

  return (
    <div className="relative w-full max-w-xl">
      <label className="sr-only">Country search</label>
      <div className="flex items-center gap-2 rounded-xl border border-nwi-border bg-[#081321]/90 px-3 py-2">
        <Search className="h-4 w-4 text-nwi-muted" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-nwi-text placeholder:text-nwi-muted/70 focus:outline-none"
        />
      </div>

      <div
        className={cn(
          'absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-xl border border-nwi-border bg-[#081321] transition',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        {candidates.map((country) => (
          <button
            type="button"
            key={country.iso2}
            className="flex w-full items-center gap-2 border-b border-nwi-border/60 px-3 py-2 text-left text-sm hover:bg-sky-500/10"
            onClick={() => {
              onPick(country);
              setQuery(country.localizedName);
              setOpen(false);
            }}
          >
            <Image
              src={country.flagUrl}
              alt={`${country.englishName} flag`}
              width={24}
              height={16}
              className="h-4 w-6 rounded-sm object-cover"
            />
            <span>{country.localizedName}</span>
            <span className="ml-auto text-xs text-nwi-muted">{country.iso2}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
