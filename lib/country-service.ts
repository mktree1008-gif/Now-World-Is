import {
  ECONOMY_UNITS,
  WORLD_BANK_GDP_INDICATOR,
  WORLD_BANK_PPP_INDICATOR
} from '@/lib/constants';
import {getCountryPhotos} from '@/lib/api/photos';
import {mockCountryDetails} from '@/lib/data/mock-country-details';
import {mockCountrySummaries} from '@/lib/data/mock-countries';
import {mockEconomicSeries} from '@/lib/data/mock-economic-series';
import {fallbackCountryPhotos} from '@/lib/data/photo-fallbacks';
import {fetchAllRestCountries, fetchRestCountryByCode} from '@/lib/api/rest-countries';
import {fetchIndicatorLatestMap, fetchIndicatorSeries} from '@/lib/api/world-bank';
import type {CountryDetail, CountryEconomicSeries, CountrySummary, SupportedLocale} from '@/lib/types';
import {getCountryFlagUrl, localizeCountryName, normalizeCountryName} from '@/lib/utils/country';
import {selectLatestValue} from '@/lib/utils/economy';

const SUMMARY_CACHE_TTL_MS = 1000 * 60 * 60 * 6;
const summaryCache = new Map<string, {at: number; data: CountrySummary[]}>();

function mockMapByIso2() {
  return new Map(mockCountrySummaries.map((country) => [country.iso2, country]));
}

function mockMapByIso3() {
  return new Map(mockCountrySummaries.map((country) => [country.iso3, country]));
}

function localizeMockSummary(summary: CountrySummary): CountrySummary {
  return summary;
}

async function buildCountrySummaries(locale: SupportedLocale): Promise<CountrySummary[]> {
  const [restCountries, gdpMap, pppMap] = await Promise.all([
    fetchAllRestCountries(),
    fetchIndicatorLatestMap(WORLD_BANK_GDP_INDICATOR),
    fetchIndicatorLatestMap(WORLD_BANK_PPP_INDICATOR)
  ]);

  if (!restCountries?.length) {
    return mockCountrySummaries.map((summary) => localizeMockSummary(summary));
  }

  const mockByIso3 = mockMapByIso3();

  const summaries = restCountries
    .filter((country) => country.cca2 && country.cca3 && country.name?.common)
    .map((country) => {
      const mock = mockByIso3.get(country.cca3);
      const gdp = gdpMap.get(country.cca3);
      const ppp = pppMap.get(country.cca3);
      const englishName = country.name?.common ?? mock?.englishName ?? country.cca3;

      return {
        iso2: country.cca2,
        iso3: country.cca3,
        localizedName: localizeCountryName(englishName, country.translations, locale),
        englishName,
        flagUrl: getCountryFlagUrl(country.cca2),
        gdpPerCapita: gdp?.value ?? mock?.gdpPerCapita ?? null,
        gdpPerCapitaYear: gdp?.year ?? mock?.gdpPerCapitaYear ?? null,
        pppGdpPerCapita: ppp?.value ?? mock?.pppGdpPerCapita ?? null,
        pppGdpPerCapitaYear: ppp?.year ?? mock?.pppGdpPerCapitaYear ?? null,
        region: country.region ?? mock?.region ?? 'Unknown',
        capital: country.capital?.[0] ?? mock?.capital ?? 'Unknown',
        population: country.population ?? mock?.population ?? null,
        averageIq: mock?.averageIq ?? null,
        averageIqYear: mock?.averageIqYear ?? null,
        averageIqSource: mock?.averageIqSource
      } satisfies CountrySummary;
    })
    .sort((a, b) => a.localizedName.localeCompare(b.localizedName));

  return summaries;
}

export async function getCountrySummaries(locale: SupportedLocale): Promise<CountrySummary[]> {
  const cached = summaryCache.get(locale);
  if (cached && Date.now() - cached.at < SUMMARY_CACHE_TTL_MS) {
    return cached.data;
  }

  const summaries = await buildCountrySummaries(locale);
  summaryCache.set(locale, {at: Date.now(), data: summaries});
  return summaries;
}

export async function searchCountrySummaries(query: string, locale: SupportedLocale, limit = 12) {
  const normalized = normalizeCountryName(query);
  const summaries = await getCountrySummaries(locale);

  if (!normalized) {
    return summaries.slice(0, limit);
  }

  return summaries
    .filter((country) => {
      const english = normalizeCountryName(country.englishName);
      const localized = normalizeCountryName(country.localizedName);
      return english.includes(normalized) || localized.includes(normalized) || country.iso2.toLowerCase() === normalized;
    })
    .slice(0, limit);
}

function fallbackDetail(iso2: string): CountryDetail {
  const mock = mockMapByIso2().get(iso2);

  return {
    iso2,
    iso3: mock?.iso3 ?? iso2,
    englishName: mock?.englishName ?? iso2,
    localizedName: mock?.localizedName ?? mock?.englishName ?? iso2,
    region: mock?.region ?? 'Unknown',
    capital: mock?.capital ?? 'Unknown',
    population: mock?.population ?? null,
    currencies: ['Data unavailable'],
    languages: ['Data unavailable'],
    majorCities: mockCountryDetails[iso2]?.majorCities ?? [],
    historySummary:
      mockCountryDetails[iso2]?.historySummary ?? 'No curated history summary yet. Add this country to the curated content layer.',
    politicalSystem: mockCountryDetails[iso2]?.politicalSystem ?? 'Data unavailable',
    governmentType: mockCountryDetails[iso2]?.governmentType ?? 'Data unavailable',
    ethnicComposition: null,
    notes: 'Demographic data not consistently available',
    averageIq: mock?.averageIq ?? null,
    averageIqYear: mock?.averageIqYear ?? null,
    averageIqSource: mock?.averageIqSource,
    photoItems: fallbackCountryPhotos[iso2] ?? fallbackCountryPhotos.US,
    economy: {
      gdpPerCapita: mock?.gdpPerCapita ?? null,
      gdpPerCapitaYear: mock?.gdpPerCapitaYear ?? null,
      pppGdpPerCapita: mock?.pppGdpPerCapita ?? null,
      pppGdpPerCapitaYear: mock?.pppGdpPerCapitaYear ?? null,
      gdpUnit: ECONOMY_UNITS.gdp,
      pppUnit: ECONOMY_UNITS.ppp
    }
  };
}

export async function getCountryDetailByIso3(iso3: string, locale: SupportedLocale): Promise<CountryDetail> {
  const summaries = await getCountrySummaries(locale);
  const summary = summaries.find((item) => item.iso3 === iso3) ?? mockCountrySummaries.find((item) => item.iso3 === iso3);

  if (!summary) {
    return fallbackDetail(iso3.slice(0, 2).toUpperCase());
  }

  const restCountry =
    (await fetchRestCountryByCode(iso3)) ||
    (await fetchRestCountryByCode(summary.iso2));

  const curated = mockCountryDetails[summary.iso2];
  const languages = restCountry?.languages ? Object.values(restCountry.languages) : ['Data unavailable'];
  const currencies = restCountry?.currencies
    ? Object.entries(restCountry.currencies).map(([code, value]) => `${value.name ?? code} (${code})`)
    : ['Data unavailable'];

  const photoItems = await getCountryPhotos(summary.englishName, summary.iso2);

  return {
    iso2: summary.iso2,
    iso3: summary.iso3,
    englishName: summary.englishName,
    localizedName: summary.localizedName,
    region: restCountry?.region ?? summary.region,
    subregion: restCountry?.subregion,
    capital: restCountry?.capital?.[0] ?? summary.capital,
    population: restCountry?.population ?? summary.population,
    currencies,
    languages,
    majorCities: curated?.majorCities ?? [],
    historySummary:
      curated?.historySummary ??
      'Curated history summary is not available yet for this country. Add a concise source-backed summary in the local content layer.',
    politicalSystem: curated?.politicalSystem ?? 'Data unavailable',
    governmentType: curated?.governmentType ?? 'Data unavailable',
    ethnicComposition: curated?.ethnicComposition ?? null,
    notes: curated?.notes ?? 'Demographic data not consistently available',
    averageIq: summary.averageIq,
    averageIqYear: summary.averageIqYear,
    averageIqSource: summary.averageIqSource,
    photoItems,
    economy: {
      gdpPerCapita: summary.gdpPerCapita,
      gdpPerCapitaYear: summary.gdpPerCapitaYear,
      pppGdpPerCapita: summary.pppGdpPerCapita,
      pppGdpPerCapitaYear: summary.pppGdpPerCapitaYear,
      gdpUnit: ECONOMY_UNITS.gdp,
      pppUnit: ECONOMY_UNITS.ppp
    }
  };
}

export async function getCountryDetailByIso2(iso2: string, locale: SupportedLocale): Promise<CountryDetail> {
  const summaries = await getCountrySummaries(locale);
  const summary = summaries.find((item) => item.iso2 === iso2.toUpperCase());

  if (!summary) {
    return fallbackDetail(iso2.toUpperCase());
  }

  return getCountryDetailByIso3(summary.iso3, locale);
}

export async function getEconomicSeriesByIso2(
  iso2List: string[],
  locale: SupportedLocale
): Promise<CountryEconomicSeries[]> {
  const summaries = await getCountrySummaries(locale);
  const summaryByIso2 = new Map(summaries.map((item) => [item.iso2, item]));

  const tasks = [...new Set(iso2List.map((iso2) => iso2.toUpperCase()))].map(async (iso2) => {
    const summary = summaryByIso2.get(iso2) ?? mockCountrySummaries.find((country) => country.iso2 === iso2);
    const fallback = mockEconomicSeries.find((item) => item.iso2 === iso2);

    if (!summary) {
      return fallback ?? null;
    }

    const [gdpSeries, pppSeries] = await Promise.all([
      fetchIndicatorSeries(summary.iso3, WORLD_BANK_GDP_INDICATOR),
      fetchIndicatorSeries(summary.iso3, WORLD_BANK_PPP_INDICATOR)
    ]);

    const latestGdp = selectLatestValue(gdpSeries);
    const latestPpp = selectLatestValue(pppSeries);

    if (!latestGdp && !latestPpp) {
      return fallback ?? null;
    }

    return {
      iso2: summary.iso2,
      iso3: summary.iso3,
      countryName: summary.localizedName,
      gdpPerCapita: gdpSeries.length ? gdpSeries : fallback?.gdpPerCapita ?? [],
      pppGdpPerCapita: pppSeries.length ? pppSeries : fallback?.pppGdpPerCapita ?? [],
      averageIq: summary.averageIq ?? fallback?.averageIq ?? null,
      averageIqYear: summary.averageIqYear ?? fallback?.averageIqYear ?? null,
      averageIqSource: summary.averageIqSource ?? fallback?.averageIqSource
    } satisfies CountryEconomicSeries;
  });

  const settled = await Promise.all(tasks);
  return settled.filter((item): item is CountryEconomicSeries => Boolean(item));
}
