import {notFound} from 'next/navigation';
import Image from 'next/image';
import {getCountryDetailByIso2} from '@/lib/country-service';
import {formatCurrencyValue, formatNumber} from '@/lib/utils/format';
import type {SupportedLocale} from '@/lib/types';
import {FavoriteToggle} from '@/components/favorite-toggle';

export default async function CountryPage({
  params
}: {
  params: Promise<{locale: SupportedLocale; iso2: string}>;
}) {
  const {locale, iso2} = await params;
  const detail = await getCountryDetailByIso2(iso2.toUpperCase(), locale);

  if (!detail) {
    notFound();
  }

  return (
    <article className="space-y-4">
      <header className="nwi-panel rounded-2xl p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Image
                src={`https://flagcdn.com/w320/${detail.iso2.toLowerCase()}.png`}
                alt={`${detail.englishName} flag`}
                width={36}
                height={24}
                className="h-6 w-9 rounded-sm"
              />
              <h1 className="text-2xl font-semibold">{detail.localizedName}</h1>
            </div>
            <p className="text-sm text-nwi-muted">
              {detail.region} | {detail.capital} | {formatNumber(detail.population ?? null, locale)}
            </p>
          </div>
          <FavoriteToggle iso2={detail.iso2} />
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="nwi-panel rounded-2xl p-4">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-cyan-100">Economy</h2>
          <p className="metric-digit text-sm">GDP per capita: {formatCurrencyValue(detail.economy.gdpPerCapita, locale)} ({detail.economy.gdpPerCapitaYear ?? 'N/A'})</p>
          <p className="metric-digit text-sm">
            PPP GDP per capita:{' '}
            {detail.economy.pppGdpPerCapita === null
              ? 'Latest data unavailable'
              : `${formatCurrencyValue(detail.economy.pppGdpPerCapita, locale)} intl$`}{' '}
            ({detail.economy.pppGdpPerCapitaYear ?? 'N/A'})
          </p>
          <p className="metric-digit mt-1 text-sm">Average IQ: {detail.averageIq ?? 'N/A'} {detail.averageIqYear ? `(${detail.averageIqYear})` : ''}</p>
          {detail.averageIqSource ? <p className="mt-1 text-[11px] text-nwi-muted">{detail.averageIqSource}</p> : null}

          <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-cyan-100">History</h3>
          <p className="mt-1 text-sm text-nwi-muted">{detail.historySummary}</p>

          <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-cyan-100">Politics</h3>
          <p className="mt-1 text-sm text-nwi-muted">{detail.politicalSystem}</p>
          <p className="text-sm text-nwi-muted">{detail.governmentType}</p>
        </div>

        <div className="nwi-panel rounded-2xl p-4">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-cyan-100">Representative photos</h2>
          <div className="grid grid-cols-2 gap-2">
            {detail.photoItems.slice(0, 4).map((photo) => (
              <div key={photo.id} className="relative h-28 overflow-hidden rounded-lg border border-nwi-border">
                <Image src={photo.url} alt={photo.alt} fill className="object-cover" sizes="(max-width: 1024px) 48vw, 260px" />
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-nwi-muted">
            <p>Languages: {detail.languages.join(', ')}</p>
            <p className="mt-1">Currencies: {detail.currencies.join(', ')}</p>
            <p className="mt-1">Major cities: {detail.majorCities.join(', ') || 'N/A'}</p>
            <p className="mt-1">Demographics: {detail.ethnicComposition?.length ? 'Source-backed subset available' : 'Data not consistently available'}</p>
          </div>
        </div>
      </section>
    </article>
  );
}
