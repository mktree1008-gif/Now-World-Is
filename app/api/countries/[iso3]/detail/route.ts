import {NextResponse} from 'next/server';
import type {SupportedLocale} from '@/lib/types';
import {getCountryDetailByIso3} from '@/lib/country-service';
import {routing} from '@/i18n/routing';

function resolveLocale(input: string | null): SupportedLocale {
  return (routing.locales.includes(input as SupportedLocale) ? input : 'en') as SupportedLocale;
}

export async function GET(
  request: Request,
  {params}: {params: Promise<{iso3: string}>}
) {
  const {iso3} = await params;
  const {searchParams} = new URL(request.url);
  const locale = resolveLocale(searchParams.get('locale'));

  if (!iso3) {
    return NextResponse.json({error: 'Missing iso3 parameter'}, {status: 400});
  }

  const data = await getCountryDetailByIso3(iso3.toUpperCase(), locale);
  return NextResponse.json({data});
}
