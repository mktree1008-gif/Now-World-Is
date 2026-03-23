import {DEFAULT_REVALIDATE_SECONDS} from '@/lib/constants';
import {fetchWithTimeout} from '@/lib/utils/fetch';

type RestCountry = {
  cca2: string;
  cca3: string;
  name?: {common?: string; official?: string};
  translations?: Record<string, {common?: string; official?: string}>;
  capital?: string[];
  region?: string;
  subregion?: string;
  population?: number;
  languages?: Record<string, string>;
  currencies?: Record<string, {name?: string; symbol?: string}>;
};

const FIELDS =
  'cca2,cca3,name,translations,capital,region,subregion,population,languages,currencies';

export async function fetchAllRestCountries(): Promise<RestCountry[] | null> {
  try {
    const response = await fetchWithTimeout(`https://restcountries.com/v3.1/all?fields=${FIELDS}`, {
      timeoutMs: 12000,
      next: {revalidate: DEFAULT_REVALIDATE_SECONDS}
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as RestCountry[];
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

export async function fetchRestCountryByCode(code: string): Promise<RestCountry | null> {
  try {
    const response = await fetchWithTimeout(
      `https://restcountries.com/v3.1/alpha/${encodeURIComponent(code)}?fields=${FIELDS}`,
      {
        timeoutMs: 12000,
        next: {revalidate: DEFAULT_REVALIDATE_SECONDS}
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as RestCountry[] | RestCountry;
    if (Array.isArray(data)) {
      return data[0] ?? null;
    }

    return data ?? null;
  } catch {
    return null;
  }
}
