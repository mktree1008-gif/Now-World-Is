'use client';

import {useEffect, useState} from 'react';
import {Search} from 'lucide-react';
import {useLocale, useTranslations} from 'next-intl';
import Image from 'next/image';
import {useRouter} from '@/i18n/navigation';

type SearchCountry = {
  iso2: string;
  localizedName: string;
  englishName: string;
  flagUrl: string;
};

export function GlobalCountrySearch() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<SearchCountry[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setItems([]);
      return;
    }

    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&locale=${locale}`, {cache: 'no-store'});
        const json = (await response.json()) as {data?: SearchCountry[]};
        setItems(json.data ?? []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, 180);

    return () => window.clearTimeout(timer);
  }, [locale, query]);

  return (
    <div className="relative hidden w-full max-w-sm lg:block">
      <div className="flex items-center gap-2 rounded-lg border border-[#2f415d] bg-[#0a1220]/90 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        <Search className="h-4 w-4 text-nwi-muted" />
        <input
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          placeholder={t('searchPlaceholder')}
          className="w-full bg-transparent text-sm text-nwi-text placeholder:text-nwi-muted/70 focus:outline-none"
        />
      </div>

      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-xl border border-[#2f415d] bg-[#0a1220]/95 backdrop-blur-md">
          {loading ? <p className="px-3 py-2 text-xs text-nwi-muted">{t('loading')}</p> : null}
          {!loading && !items.length ? <p className="px-3 py-2 text-xs text-nwi-muted">No matches</p> : null}
          {items.map((item) => (
            <button
              type="button"
              key={item.iso2}
              className="flex w-full items-center gap-2 border-b border-[#1e304a] px-3 py-2 text-left text-sm hover:bg-cyan-400/10"
              onClick={() => {
                router.push(`/?country=${item.iso2}`);
                setOpen(false);
              }}
            >
              <Image
                src={item.flagUrl}
                alt={`${item.englishName} flag`}
                width={24}
                height={16}
                className="h-4 w-6 rounded-sm object-cover"
              />
              <span>{item.localizedName}</span>
              <span className="ml-auto text-xs text-nwi-muted">{item.iso2}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
