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
  'iran islamic republic of': 'IR',
  'syrian arab republic': 'SY',
  'tanzania united republic of': 'TZ',
  'venezuela bolivarian republic of': 'VE',
  'bolivia plurinational state of': 'BO'
};

export function resolveIso2ByName(name: string, summaries: CountrySummary[]): string | undefined {
  const normalized = normalizeCountryName(name);
  const aliasMatch = nameAliases[normalized];

  if (aliasMatch) {
    return aliasMatch;
  }

  return summaries.find((country) => normalizeCountryName(country.englishName) === normalized)?.iso2;
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
