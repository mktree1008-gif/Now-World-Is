'use client';

import useSWR from 'swr';
import type {CountryDetail} from '@/lib/types';

async function fetcher(url: string) {
  const response = await fetch(url, {cache: 'no-store'});
  const json = (await response.json()) as {data?: CountryDetail; error?: string};

  if (!response.ok || !json.data) {
    throw new Error(json.error || 'Failed to fetch country detail');
  }

  return json.data;
}

export function useCountryDetail(iso3: string | null, locale: string) {
  const key = iso3 ? `/api/countries/${iso3}/detail?locale=${encodeURIComponent(locale)}` : null;

  return useSWR<CountryDetail>(key, fetcher, {
    keepPreviousData: true
  });
}
