import type {CountrySummary, SupportedLocale} from '@/lib/types';

const localeNameFieldMap: Partial<Record<SupportedLocale, string>> = {
  ko: 'kor',
  fr: 'fra',
  de: 'deu',
  ja: 'jpn',
  'zh-CN': 'zho',
  es: 'spa',
  pt: 'por',
  it: 'ita',
  nl: 'nld',
  ar: 'ara',
  hi: 'hin',
  tr: 'tur',
  ru: 'rus',
  vi: 'vie',
  th: 'tha',
  id: 'ind'
};

export function normalizeCountryName(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

const nameAliases: Record<string, string> = {
  'united states of america': 'US',
  'united states': 'US',
  'korea republic of': 'KR',
  'south korea': 'KR',
  'republic of korea': 'KR',
  'korea': 'KR',
  "korea democratic people's republic of": 'KP',
  'russian federation': 'RU',
  'czechia': 'CZ',
  'viet nam': 'VN',
  'lao peoples democratic republic': 'LA',
  'united kingdom': 'GB',
  'united kingdom of great britain and northern ireland': 'GB',
  'iran islamic republic of': 'IR',
  'syrian arab republic': 'SY',
  'tanzania united republic of': 'TZ',
  'venezuela bolivarian republic of': 'VE',
  'bolivia plurinational state of': 'BO',
  "cote d'ivoire": 'CI',
  'cote divoire': 'CI',
  'ivory coast': 'CI',
  'democratic republic of the congo': 'CD',
  'republic of the congo': 'CG'
};

export function resolveIso2ByName(name: string, summaries: CountrySummary[]): string | undefined {
  const normalized = normalizeCountryName(name);
  const aliasMatch = nameAliases[normalized];

  if (aliasMatch) {
    return aliasMatch;
  }

  return summaries.find((country) => normalizeCountryName(country.englishName) === normalized)?.iso2;
}

type GeoCountryLike = {
  id?: string | number;
  properties?: Record<string, unknown>;
};

function resolveIso2ByCode(codeRaw: unknown, summaries: CountrySummary[]): string | undefined {
  const code = typeof codeRaw === 'string' ? codeRaw.trim().toUpperCase() : String(codeRaw ?? '').trim().toUpperCase();

  if (!code || code === '-99') {
    return undefined;
  }

  if (code.length === 2) {
    return summaries.find((country) => country.iso2 === code)?.iso2;
  }

  if (code.length === 3) {
    return summaries.find((country) => country.iso3 === code)?.iso2;
  }

  return undefined;
}

export function resolveIso2FromGeo(geo: GeoCountryLike, summaries: CountrySummary[]): string | undefined {
  const byId = resolveIso2ByCode(geo.id, summaries);
  if (byId) {
    return byId;
  }

  const props = geo.properties ?? {};
  const codeCandidates = [
    props.iso_a2,
    props.ISO_A2,
    props.iso2,
    props.ISO2,
    props.wb_a2,
    props.WB_A2,
    props.iso_a3,
    props.ISO_A3,
    props.adm0_a3,
    props.ADM0_A3,
    props.wb_a3,
    props.WB_A3
  ];

  for (const code of codeCandidates) {
    const resolved = resolveIso2ByCode(code, summaries);
    if (resolved) {
      return resolved;
    }
  }

  const nameCandidates = [props.name, props.NAME, props.admin, props.ADMIN, props.sovereignt, props.SOVEREIGNT];

  for (const value of nameCandidates) {
    if (typeof value === 'string' && value.trim()) {
      const resolved = resolveIso2ByName(value, summaries);
      if (resolved) {
        return resolved;
      }
    }
  }

  return undefined;
}

export function localizeCountryName(
  englishName: string,
  translations: Record<string, {common?: string; official?: string}> | undefined,
  locale: SupportedLocale
): string {
  if (locale === 'en') {
    return englishName;
  }

  const field = localeNameFieldMap[locale];
  if (!field || !translations?.[field]) {
    return englishName;
  }

  return translations[field].common || translations[field].official || englishName;
}

export function getCountryFlagUrl(iso2: string): string {
  return `https://flagcdn.com/w320/${iso2.toLowerCase()}.png`;
}
