'use client';

import useSWR from 'swr';
import type {CountryEconomicSeries} from '@/lib/types';
import {calculateAnnualGrowth} from '@/lib/utils/economy';

type GrowthPayload = {
  gdpGrowth: {value: number; fromYear: number; toYear: number} | null;
  pppGrowth: {value: number; fromYear: number; toYear: number} | null;
};

async function fetchGrowth(url: string): Promise<GrowthPayload> {
  const response = await fetch(url, {cache: 'no-store'});
  const json = (await response.json()) as {data?: CountryEconomicSeries[]};
  const series = json.data?.[0];

  if (!response.ok || !series) {
    return {gdpGrowth: null, pppGrowth: null};
  }

  return {
    gdpGrowth: calculateAnnualGrowth(series.gdpPerCapita),
    pppGrowth: calculateAnnualGrowth(series.pppGdpPerCapita)
  };
}

export function useCountryGrowth(iso2: string | null, locale: string) {
  const key = iso2 ? `/api/countries/series?locale=${encodeURIComponent(locale)}&iso2=${encodeURIComponent(iso2)}` : null;

  return useSWR<GrowthPayload>(key, fetchGrowth, {
    dedupingInterval: 1000 * 60 * 20,
    revalidateOnFocus: false,
    keepPreviousData: true
  });
}
