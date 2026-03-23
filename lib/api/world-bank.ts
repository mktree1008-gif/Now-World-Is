import {DEFAULT_REVALIDATE_SECONDS} from '@/lib/constants';
import {fetchWithTimeout} from '@/lib/utils/fetch';

type WorldBankRow = {
  countryiso3code: string;
  date: string;
  value: number | null;
};

function isWorldBankData(payload: unknown): payload is [unknown, WorldBankRow[]] {
  return Array.isArray(payload) && payload.length === 2 && Array.isArray(payload[1]);
}

export async function fetchIndicatorLatestMap(indicator: string) {
  try {
    const response = await fetchWithTimeout(
      `https://api.worldbank.org/v2/country/all/indicator/${indicator}?format=json&per_page=20000`,
      {
        timeoutMs: 14000,
        // World Bank "all countries" payloads exceed Next data-cache 2MB limit.
        // We use process memory caching in country-service instead.
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      return new Map<string, {year: number; value: number}>();
    }

    const payload = (await response.json()) as unknown;

    if (!isWorldBankData(payload)) {
      return new Map<string, {year: number; value: number}>();
    }

    const rows = payload[1];
    const latest = new Map<string, {year: number; value: number}>();

    for (const row of rows) {
      if (!row.countryiso3code || row.countryiso3code.length !== 3 || row.value === null) {
        continue;
      }

      const year = Number(row.date);
      if (!Number.isFinite(year)) {
        continue;
      }

      const existing = latest.get(row.countryiso3code);
      if (!existing || year > existing.year) {
        latest.set(row.countryiso3code, {year, value: Number(row.value)});
      }
    }

    return latest;
  } catch {
    return new Map<string, {year: number; value: number}>();
  }
}

export async function fetchIndicatorSeries(iso3: string, indicator: string, mrv = 15) {
  try {
    const response = await fetchWithTimeout(
      `https://api.worldbank.org/v2/country/${iso3}/indicator/${indicator}?format=json&mrv=${mrv}`,
      {
        timeoutMs: 12000,
        next: {revalidate: DEFAULT_REVALIDATE_SECONDS}
      }
    );

    if (!response.ok) {
      return [] as Array<{year: number; value: number | null}>;
    }

    const payload = (await response.json()) as unknown;

    if (!isWorldBankData(payload)) {
      return [] as Array<{year: number; value: number | null}>;
    }

    return payload[1]
      .map((row) => ({year: Number(row.date), value: row.value === null ? null : Number(row.value)}))
      .filter((row) => Number.isFinite(row.year))
      .sort((a, b) => a.year - b.year);
  } catch {
    return [] as Array<{year: number; value: number | null}>;
  }
}
