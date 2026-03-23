import {getCountrySummaries} from '@/lib/country-service';
import type {CompareMetric, SupportedLocale} from '@/lib/types';
import {CompareWorkbench} from '@/components/compare-workbench';
import {getTranslations} from 'next-intl/server';

const ALLOWED_METRICS: CompareMetric[] = ['gdpPerCapita', 'pppGdpPerCapita', 'averageIq'];

function parseList(value: string | string[] | undefined) {
  const text = Array.isArray(value) ? value.join(',') : value ?? '';
  return text
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default async function ComparePage({
  params,
  searchParams
}: {
  params: Promise<{locale: SupportedLocale}>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const {locale} = await params;
  const query = await searchParams;
  const tCompare = await getTranslations({locale, namespace: 'compare'});

  const countries = await getCountrySummaries(locale);
  const initialCountries = parseList(query.countries).map((item) => item.toUpperCase());
  const initialMetrics = parseList(query.metrics).filter((item): item is CompareMetric =>
    ALLOWED_METRICS.includes(item as CompareMetric)
  );

  return (
    <CompareWorkbench
      locale={locale}
      countries={countries}
      initialCountries={initialCountries}
      initialMetrics={initialMetrics}
      title={tCompare('title')}
      subtitle={tCompare('subtitle')}
    />
  );
}
