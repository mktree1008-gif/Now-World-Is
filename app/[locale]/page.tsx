import {getCountrySummaries} from '@/lib/country-service';
import {WorldExplorer} from '@/components/world-explorer';
import type {SupportedLocale} from '@/lib/types';

function parseFloatOr(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default async function HomePage({
  params,
  searchParams
}: {
  params: Promise<{locale: SupportedLocale}>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const {locale} = await params;
  const query = await searchParams;
  const countries = await getCountrySummaries(locale);

  const view = query.view === 'globe' ? 'globe' : 'map';
  const initialCountry = typeof query.country === 'string' ? query.country.toUpperCase() : null;
  const lat = typeof query.lat === 'string' ? parseFloatOr(query.lat, 18) : 18;
  const lng = typeof query.lng === 'string' ? parseFloatOr(query.lng, 8) : 8;
  const zoom = typeof query.zoom === 'string' ? parseFloatOr(query.zoom, 1.08) : 1.08;

  return (
    <WorldExplorer
      locale={locale}
      countries={countries}
      initialView={view}
      initialCountryIso2={initialCountry}
      initialCenter={[lng, lat]}
      initialZoom={zoom}
    />
  );
}
