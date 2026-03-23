export type SupportedLocale =
  | 'en'
  | 'ko'
  | 'fr'
  | 'de'
  | 'ja'
  | 'zh-CN'
  | 'es'
  | 'pt'
  | 'it'
  | 'nl'
  | 'ar'
  | 'hi'
  | 'tr'
  | 'ru'
  | 'vi'
  | 'th'
  | 'id';

export type CountrySummary = {
  iso2: string;
  iso3: string;
  localizedName: string;
  englishName: string;
  flagUrl: string;
  gdpPerCapita: number | null;
  gdpPerCapitaYear: number | null;
  pppGdpPerCapita: number | null;
  pppGdpPerCapitaYear: number | null;
  region: string;
  capital: string;
  population: number | null;
  averageIq: number | null;
  averageIqYear: number | null;
  averageIqSource?: string;
};

export type CountryPhoto = {
  id: string;
  url: string;
  alt: string;
  source: 'pexels' | 'unsplash' | 'fallback';
  photographer?: string;
  photographerUrl?: string;
};

export type CountryDetail = {
  iso2: string;
  iso3: string;
  englishName: string;
  localizedName: string;
  region: string;
  subregion?: string;
  capital?: string;
  population?: number | null;
  currencies: string[];
  languages: string[];
  majorCities: string[];
  historySummary: string;
  politicalSystem: string;
  governmentType: string;
  ethnicComposition: Array<{label: string; value: string}> | null;
  notes?: string;
  averageIq: number | null;
  averageIqYear: number | null;
  averageIqSource?: string;
  photoItems: CountryPhoto[];
  economy: {
    gdpPerCapita: number | null;
    gdpPerCapitaYear: number | null;
    pppGdpPerCapita: number | null;
    pppGdpPerCapitaYear: number | null;
    gdpUnit: string;
    pppUnit: string;
  };
};

export type MetricPoint = {
  year: number;
  value: number | null;
};

export type CountryEconomicSeries = {
  iso2: string;
  iso3: string;
  countryName: string;
  gdpPerCapita: MetricPoint[];
  pppGdpPerCapita: MetricPoint[];
  averageIq: number | null;
  averageIqYear: number | null;
  averageIqSource?: string;
};

export type CompareMetric = 'gdpPerCapita' | 'pppGdpPerCapita' | 'averageIq';

export type CountryCuratedContent = {
  historySummary: string;
  politicalSystem: string;
  governmentType: string;
  ethnicComposition: Array<{label: string; value: string}> | null;
  majorCities: string[];
  notes?: string;
};
