import {getCountrySummaries} from '@/lib/country-service';
import type {SupportedLocale} from '@/lib/types';
import {FavoritesPanel} from '@/components/favorites-panel';

export default async function FavoritesPage({params}: {params: Promise<{locale: SupportedLocale}>}) {
  const {locale} = await params;
  const countries = await getCountrySummaries(locale);

  return <FavoritesPanel locale={locale} countries={countries} />;
}
