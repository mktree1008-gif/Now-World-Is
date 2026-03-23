export const WORLD_GEO_URL = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';

export const WORLD_BANK_GDP_INDICATOR = 'NY.GDP.PCAP.CD';
export const WORLD_BANK_PPP_INDICATOR = 'NY.GDP.PCAP.PP.CD';

export const ECONOMY_UNITS = {
  gdp: 'current US$',
  ppp: 'current international $'
} as const;

export const DEFAULT_REVALIDATE_SECONDS = 60 * 60 * 24;

export const PHOTO_CATEGORY_QUERIES = ['people daily life', 'skyline city', 'landmark landscape', 'street culture'] as const;
