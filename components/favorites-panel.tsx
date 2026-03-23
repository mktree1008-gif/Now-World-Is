'use client';

import {useMemo, useState} from 'react';
import Image from 'next/image';
import {useRouter} from '@/i18n/navigation';
import {useTranslations} from 'next-intl';
import type {CompareMetric, CountrySummary} from '@/lib/types';
import {useFavorites} from '@/lib/hooks/use-favorites';
import {formatCurrencyValue} from '@/lib/utils/format';

export function FavoritesPanel({locale, countries}: {locale: string; countries: CountrySummary[]}) {
  const t = useTranslations('favorites');
  const tCountry = useTranslations('country');
  const router = useRouter();
  const {favorites, isEnabled} = useFavorites();

  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<CompareMetric[]>(['gdpPerCapita', 'pppGdpPerCapita', 'averageIq']);

  const favoriteCountries = useMemo(() => {
    const set = new Set(favorites.map((item) => item.iso2));
    return countries.filter((country) => set.has(country.iso2));
  }, [countries, favorites]);

  return (
    <section className="space-y-4">
      <header className="nwi-panel rounded-2xl p-4">
        <h1 className="text-xl font-semibold">{t('title')}</h1>
        <p className="mt-1 text-sm text-nwi-muted">{t('subtitle')}</p>
      </header>

      {!isEnabled ? (
        <div className="nwi-panel rounded-2xl p-4 text-sm text-nwi-muted">Log in to sync favorites across devices.</div>
      ) : null}

      <div className="nwi-panel rounded-2xl p-4">
        {!favoriteCountries.length ? (
          <p className="text-sm text-nwi-muted">{t('empty')}</p>
        ) : (
          <div className="space-y-3">
            {favoriteCountries.map((country) => {
              const checked = selectedCountries.includes(country.iso2);
              return (
                <label key={country.iso2} className="flex items-center gap-3 rounded-lg border border-nwi-border bg-[#0a1524] px-3 py-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      setSelectedCountries((current) => {
                        if (checked) {
                          return current.filter((item) => item !== country.iso2);
                        }
                        return [...current, country.iso2].slice(0, 8);
                      });
                    }}
                  />
                  <Image
                    src={country.flagUrl}
                    alt={`${country.englishName} flag`}
                    width={32}
                    height={20}
                    className="h-5 w-8 rounded-sm"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{country.localizedName}</p>
                    <p className="text-xs text-nwi-muted">
                      {tCountry('gdp')}: {formatCurrencyValue(country.gdpPerCapita, locale)} | {tCountry('ppp')}:{' '}
                      {country.pppGdpPerCapita === null
                        ? 'Latest data unavailable'
                        : `${formatCurrencyValue(country.pppGdpPerCapita, locale)} intl$`}{' '}
                      | {tCountry('iq')}: {country.averageIq ?? 'N/A'}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        )}

        {favoriteCountries.length ? (
          <>
            <div className="mt-4 grid gap-2 md:grid-cols-3">
              {([
                ['gdpPerCapita', tCountry('gdp')],
                ['pppGdpPerCapita', tCountry('ppp')],
                ['averageIq', tCountry('iq')]
              ] as Array<[CompareMetric, string]>).map(([metric, label]) => {
                const checked = metrics.includes(metric);
                return (
                  <label key={metric} className="flex items-center gap-2 rounded-md border border-nwi-border bg-[#0a1524] px-2 py-1 text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        setMetrics((current) => {
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
              disabled={!selectedCountries.length}
              onClick={() => {
                const countriesQuery = selectedCountries.join(',');
                const metricsQuery = metrics.join(',');
                router.push(
                  `/compare?countries=${encodeURIComponent(countriesQuery)}&metrics=${encodeURIComponent(metricsQuery)}`
                );
              }}
              className="mt-4 rounded-lg border border-sky-400/60 bg-sky-500/20 px-4 py-2 text-sm font-medium text-sky-100 disabled:opacity-50"
            >
              {t('compareAction')}
            </button>
          </>
        ) : null}
      </div>
    </section>
  );
}
