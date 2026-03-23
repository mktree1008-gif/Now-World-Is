import {NextResponse} from 'next/server';
import type {SupportedLocale} from '@/lib/types';
import {getCountrySummaries} from '@/lib/country-service';
import {routing} from '@/i18n/routing';

function resolveLocale(input: string | null): SupportedLocale {
  return (routing.locales.includes(input as SupportedLocale) ? input : 'en') as SupportedLocale;
}

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const locale = resolveLocale(searchParams.get('locale'));
  const data = await getCountrySummaries(locale);
  return NextResponse.json({data, source: 'normalized'});
}
