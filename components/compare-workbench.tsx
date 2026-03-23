'use client';

import {useMemo, useState} from 'react';
import useSWR from 'swr';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useTranslations} from 'next-intl';
import Image from 'next/image';
import type {CompareMetric, CountryEconomicSeries, CountrySummary} from '@/lib/types';
import {MetricLineChart} from '@/components/metric-line-chart';
import {IQBarChart} from '@/components/iq-bar-chart';

const metricOptions: CompareMetric[] = ['gdpPerCapita', 'pppGdpPerCapita', 'averageIq'];

async function fetcher(url: string) {
  const response = await fetch(url, {cache: 'no-store'});
  const json = (await response.json()) as {data?: CountryEconomicSeries[]; error?: string};

  if (!response.ok || !json.data) {
    throw new Error(json.error || 'Failed to fetch compare data');
  }

  return json.data;
}

function latestValue(country: CountryEconomicSeries, metric: 'gdpPerCapita' | 'pppGdpPerCapita') {
  const latest = [...country[metric]].sort((a, b) => b.year - a.year).find((point) => point.value !== null);
  return latest?.value ?? null;
}

export function CompareWorkbench({
  locale,
  countries,
  initialCountries,
  initialMetrics,
  title,
  subtitle
}: {
  locale: string;
  countries: CountrySummary[];
  initialCountries: string[];
  initialMetrics: CompareMetric[];
  title: string;
  subtitle: string;
}) {
  const tCompare = useTranslations('compare');
  const tCountry = useTranslations('country');
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCountries, setSelectedCountries] = useState<string[]>(initialCountries);
  const [selectedMetrics, setSelectedMetrics] = useState<CompareMetric[]>(
    initialMetrics.length ? initialMetrics : ['gdpPerCapita', 'pppGdpPerCapita']
  );

  const query = selectedCountries.join(',');
  const {data, error, isLoading} = useSWR<CountryEconomicSeries[]>(
    selectedCountries.length ? `/api/countries/series?locale=${locale}&iso2=${encodeURIComponent(query)}` : null,
    fetcher
  );

  const selectedSet = useMemo(() => new Set(selectedCountries), [selectedCountries]);
  const selectedMetricSet = useMemo(() => new Set(selectedMetrics), [selectedMetrics]);

  const runCompare = () => {
    const next = new URLSearchParams(searchParams.toString());
    next.set('countries', selectedCountries.join(','));
    next.set('metrics', selectedMetrics.join(','));
    router.replace(`${pathname}?${next.toString()}`, {scroll: false});
  };

  return (
    <section className="nwi-panel rounded-2xl p-4">
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="mt-1 text-sm text-nwi-muted">{subtitle}</p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-nwi-border bg-[#0a1524] p-3">
          <h2 className="mb-2 text-sm font-semibold text-cyan-100">{tCompare('countrySelection')}</h2>
          <div className="max-h-60 space-y-1 overflow-auto pr-1">
            {countries.slice(0, 80).map((country) => {
              const checked = selectedSet.has(country.iso2);
              return (
                <label key={country.iso2} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-sky-500/10">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      setSelectedCountries((current) => {
                        if (checked) {
                          return current.filter((value) => value !== country.iso2);
                        }
                        return [...current, country.iso2].slice(0, 8);
                      });
                    }}
                  />
                  <Image
                    src={country.flagUrl}
                    alt={`${country.englishName} flag`}
                    width={24}
                    height={16}
                    className="h-4 w-6 rounded-sm"
                  />
                  <span>{country.localizedName}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-nwi-border bg-[#0a1524] p-3">
          <h2 className="mb-2 text-sm font-semibold text-cyan-100">{tCompare('metricSelection')}</h2>
          <div className="space-y-2 text-sm">
            {metricOptions.map((metric) => {
              const checked = selectedMetricSet.has(metric);
              const label = metric === 'gdpPerCapita' ? tCountry('gdp') : metric === 'pppGdpPerCapita' ? tCountry('ppp') : tCountry('iq');

              return (
                <label key={metric} className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-sky-500/10">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      setSelectedMetrics((current) => {
                        if (checked) {
                          return current.filter((item) => item !== metric);
                        }
                        return [...current, metric];
                      });
                    }}
                  />
                  <span>{label}</span>
                </label>
              );
            })}
          </div>

          <button
            type="button"
            onClick={runCompare}
            className="mt-4 w-full rounded-lg border border-sky-400/60 bg-sky-500/20 px-3 py-2 text-sm font-medium text-sky-100"
          >
            {tCompare('run')}
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-5">
        {isLoading ? <p className="text-sm text-nwi-muted">Loading compare data...</p> : null}
        {error ? <p className="text-sm text-rose-300">{String(error)}</p> : null}
        {!isLoading && !error && data && !data.length ? <p className="text-sm text-nwi-muted">{tCompare('noData')}</p> : null}

        {data && selectedMetricSet.has('gdpPerCapita') ? (
          <div className="rounded-xl border border-nwi-border bg-[#0a1524] p-3">
            <h3 className="mb-2 text-sm font-semibold text-cyan-100">{tCountry('gdp')}</h3>
            <MetricLineChart data={data} metric="gdpPerCapita" locale={locale} />
          </div>
        ) : null}

        {data && selectedMetricSet.has('pppGdpPerCapita') ? (
          <div className="rounded-xl border border-nwi-border bg-[#0a1524] p-3">
            <h3 className="mb-2 text-sm font-semibold text-cyan-100">{tCountry('ppp')}</h3>
            <MetricLineChart data={data} metric="pppGdpPerCapita" locale={locale} />
          </div>
        ) : null}

        {data && selectedMetricSet.has('averageIq') ? (
          <div className="rounded-xl border border-nwi-border bg-[#0a1524] p-3">
            <h3 className="mb-2 text-sm font-semibold text-cyan-100">{tCompare('iqStatic')}</h3>
            <p className="mb-2 text-xs text-nwi-muted">{tCompare('iqStaticNote')}</p>
            <IQBarChart data={data} />
          </div>
        ) : null}

        {data?.length ? (
          <div className="rounded-xl border border-nwi-border bg-[#0a1524] p-3">
            <h3 className="mb-2 text-sm font-semibold text-cyan-100">{tCompare('table')}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="border-b border-nwi-border text-nwi-muted">
                    <th className="px-2 py-2 text-left">Country</th>
                    <th className="px-2 py-2 text-left">GDP (latest)</th>
                    <th className="px-2 py-2 text-left">PPP (latest)</th>
                    <th className="px-2 py-2 text-left">IQ</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.iso2} className="border-b border-nwi-border/50">
                      <td className="px-2 py-2">{row.countryName}</td>
                      <td className="px-2 py-2">
                        {latestValue(row, 'gdpPerCapita') !== null
                          ? new Intl.NumberFormat(locale, {maximumFractionDigits: 0}).format(latestValue(row, 'gdpPerCapita') ?? 0)
                          : 'N/A'}
                      </td>
                      <td className="px-2 py-2">
                        {latestValue(row, 'pppGdpPerCapita') !== null
                          ? new Intl.NumberFormat(locale, {maximumFractionDigits: 0}).format(latestValue(row, 'pppGdpPerCapita') ?? 0)
                          : 'N/A'}
                      </td>
                      <td className="px-2 py-2">{row.averageIq ?? 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
