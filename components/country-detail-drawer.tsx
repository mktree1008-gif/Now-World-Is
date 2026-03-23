'use client';

import {AnimatePresence, motion} from 'framer-motion';
import {X} from 'lucide-react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import type {CountrySummary} from '@/lib/types';
import {useCountryDetail} from '@/lib/hooks/use-country-detail';
import {formatCurrencyValue, formatNumber} from '@/lib/utils/format';
import {FavoriteToggle} from '@/components/favorite-toggle';

type Props = {
  open: boolean;
  locale: string;
  summary: CountrySummary | null;
  onClose: () => void;
};

export function CountryDetailDrawer({open, locale, summary, onClose}: Props) {
  const tCountry = useTranslations('country');
  const {data, isLoading} = useCountryDetail(summary?.iso3 ?? null, locale);
  const detail = data;

  return (
    <AnimatePresence>
      {open && summary ? (
        <>
          <motion.button
            type="button"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/55"
          />
          <motion.aside
            initial={{x: 420}}
            animate={{x: 0}}
            exit={{x: 420}}
            transition={{type: 'spring', damping: 28, stiffness: 250}}
            className="fixed bottom-0 right-0 top-0 z-50 w-full overflow-y-auto border-l border-nwi-border bg-[#081320] p-4 md:w-[440px]"
            role="dialog"
            aria-label={summary.localizedName}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <Image
                    src={summary.flagUrl}
                    alt={`${summary.englishName} flag`}
                    width={32}
                    height={20}
                    className="h-5 w-8 rounded-sm"
                  />
                  <h2 className="text-xl font-semibold">{summary.localizedName}</h2>
                </div>
                <p className="text-sm text-nwi-muted">
                  {tCountry('heroRegion')}: {summary.region} | {tCountry('heroCapital')}: {summary.capital}
                </p>
                <a
                  href={`/s/${summary.iso2.toLowerCase()}`}
                  className="mt-2 inline-flex rounded-md border border-nwi-border px-2 py-1 text-xs text-nwi-muted hover:text-nwi-text"
                >
                  Open shareable URL
                </a>
              </div>
              <div className="flex items-center gap-2">
                <FavoriteToggle iso2={summary.iso2} />
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-nwi-border bg-[#0d1a2a] p-2 text-nwi-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {isLoading || !detail ? (
              <div className="space-y-3">
                <div className="h-44 animate-pulse rounded-xl bg-white/5" />
                <div className="h-20 animate-pulse rounded-xl bg-white/5" />
                <div className="h-28 animate-pulse rounded-xl bg-white/5" />
              </div>
            ) : (
              <div className="space-y-4">
                <section>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-cyan-100">{tCountry('photos')}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {detail.photoItems.slice(0, 4).map((photo) => (
                      <div key={photo.id} className="relative h-28 overflow-hidden rounded-lg border border-nwi-border">
                        <Image
                          src={photo.url}
                          alt={photo.alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 45vw, 200px"
                        />
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-xl border border-nwi-border bg-[#0c1928] p-3">
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-cyan-100">{tCountry('economy')}</h3>
                  <p className="metric-digit text-sm text-nwi-text">
                    {tCountry('gdp')}: {formatCurrencyValue(detail.economy.gdpPerCapita, locale)} ({detail.economy.gdpPerCapitaYear ?? 'N/A'})
                  </p>
                  <p className="metric-digit text-sm text-nwi-text">
                    {tCountry('ppp')}:{' '}
                    {detail.economy.pppGdpPerCapita === null
                      ? 'Latest data unavailable'
                      : `${formatCurrencyValue(detail.economy.pppGdpPerCapita, locale)} intl$`}{' '}
                    ({detail.economy.pppGdpPerCapitaYear ?? 'N/A'})
                  </p>
                  <p className="metric-digit text-sm text-nwi-text">
                    {tCountry('iq')}: {detail.averageIq ?? 'N/A'} {detail.averageIqYear ? `(${detail.averageIqYear})` : ''}
                  </p>
                  {detail.averageIqSource ? <p className="mt-1 text-[11px] text-nwi-muted">{detail.averageIqSource}</p> : null}
                </section>

                <section className="grid grid-cols-2 gap-2 text-xs text-nwi-muted">
                  <div className="rounded-lg border border-nwi-border bg-[#0c1928] p-3">
                    {tCountry('heroPopulation')}
                    <p className="metric-digit mt-1 text-sm text-nwi-text">{formatNumber(detail.population ?? null, locale)}</p>
                  </div>
                  <div className="rounded-lg border border-nwi-border bg-[#0c1928] p-3">
                    {tCountry('currency')}
                    <p className="mt-1 text-sm text-nwi-text">{detail.currencies.slice(0, 2).join(', ')}</p>
                  </div>
                  <div className="col-span-2 rounded-lg border border-nwi-border bg-[#0c1928] p-3">
                    {tCountry('languages')}
                    <p className="mt-1 text-sm text-nwi-text">{detail.languages.join(', ')}</p>
                  </div>
                </section>

                <section className="rounded-xl border border-nwi-border bg-[#0c1928] p-3 text-sm text-nwi-muted">
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-cyan-100">{tCountry('history')}</h3>
                  <p>{detail.historySummary}</p>
                </section>

                <section className="rounded-xl border border-nwi-border bg-[#0c1928] p-3 text-sm text-nwi-muted">
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-cyan-100">{tCountry('politics')}</h3>
                  <p>{detail.politicalSystem}</p>
                  <p className="mt-1">{detail.governmentType}</p>
                </section>

                <section className="rounded-xl border border-nwi-border bg-[#0c1928] p-3 text-sm text-nwi-muted">
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-cyan-100">{tCountry('demographics')}</h3>
                  {detail.ethnicComposition?.length ? (
                    <ul className="space-y-1">
                      {detail.ethnicComposition.map((item) => (
                        <li key={item.label}>
                          {item.label}: {item.value}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>{tCountry('demographicsUnavailable')}</p>
                  )}
                  {detail.notes ? <p className="mt-2 text-[11px]">{detail.notes}</p> : null}
                </section>
              </div>
            )}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
