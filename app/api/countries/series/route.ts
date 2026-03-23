import {NextResponse} from 'next/server';
import type {SupportedLocale} from '@/lib/types';
import {getEconomicSeriesByIso2} from '@/lib/country-service';
import {routing} from '@/i18n/routing';

function resolveLocale(input: string | null): SupportedLocale {
  return (routing.locales.includes(input as SupportedLocale) ? input : 'en') as SupportedLocale;
}

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const locale = resolveLocale(searchParams.get('locale'));
  const iso2List = (searchParams.get('iso2') ?? '')
    .split(',')
    .map((value) => value.trim().toUpperCase())
    .filter(Boolean);

  if (!iso2List.length) {
    return NextResponse.json({error: 'Missing iso2 query parameter'}, {status: 400});
  }

  const data = await getEconomicSeriesByIso2(iso2List, locale);
  return NextResponse.json({data, metrics: ['gdpPerCapita', 'pppGdpPerCapita', 'averageIq']});
}
