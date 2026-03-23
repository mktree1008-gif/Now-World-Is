import type {CountryPhoto} from '@/lib/types';

const fallback = (country: string): CountryPhoto[] => [
  {
    id: `${country}-fallback-1`,
    url: '/images/photo-unavailable-1.svg',
    alt: `${country} representative photo placeholder 1`,
    source: 'fallback'
  },
  {
    id: `${country}-fallback-2`,
    url: '/images/photo-unavailable-2.svg',
    alt: `${country} representative photo placeholder 2`,
    source: 'fallback'
  },
  {
    id: `${country}-fallback-3`,
    url: '/images/photo-unavailable-3.svg',
    alt: `${country} representative photo placeholder 3`,
    source: 'fallback'
  },
  {
    id: `${country}-fallback-4`,
    url: '/images/photo-unavailable-4.svg',
    alt: `${country} representative photo placeholder 4`,
    source: 'fallback'
  }
];

export const fallbackCountryPhotos: Record<string, CountryPhoto[]> = {
  US: fallback('United States'),
  KR: fallback('South Korea'),
  JP: fallback('Japan'),
  DE: fallback('Germany'),
  FR: fallback('France'),
  GB: fallback('United Kingdom'),
  CN: fallback('China'),
  IN: fallback('India'),
  BR: fallback('Brazil'),
  ZA: fallback('South Africa'),
  AE: fallback('United Arab Emirates'),
  ID: fallback('Indonesia')
};
