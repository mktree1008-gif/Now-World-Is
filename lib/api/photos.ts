import {PHOTO_CATEGORY_QUERIES} from '@/lib/constants';
import {fallbackCountryPhotos} from '@/lib/data/photo-fallbacks';
import type {CountryPhoto} from '@/lib/types';
import {fetchWithTimeout} from '@/lib/utils/fetch';

type PexelsPhoto = {
  id: number;
  alt?: string;
  photographer?: string;
  photographer_url?: string;
  src?: {large2x?: string; large?: string; medium?: string};
};

type UnsplashPhoto = {
  id: string;
  alt_description?: string;
  user?: {name?: string; links?: {html?: string}};
  urls?: {regular?: string; small?: string};
};

function isFulfilled<T>(result: PromiseSettledResult<T>): result is PromiseFulfilledResult<T> {
  return result.status === 'fulfilled';
}

async function searchPexels(countryName: string): Promise<CountryPhoto[]> {
  // Add your key in .env.local -> PEXELS_API_KEY
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    return [];
  }

  const requests = PHOTO_CATEGORY_QUERIES.map(async (category) => {
    const query = encodeURIComponent(`${countryName} ${category}`);
    const response = await fetchWithTimeout(
      `https://api.pexels.com/v1/search?query=${query}&per_page=1&orientation=landscape`,
      {
        headers: {Authorization: apiKey},
        timeoutMs: 9000,
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {photos?: PexelsPhoto[]};
    const photo = payload.photos?.[0];
    if (!photo?.src?.large) {
      return null;
    }

    return {
      id: `pexels-${photo.id}`,
      url: photo.src.large2x || photo.src.large || photo.src.medium || '',
      alt: photo.alt || `${countryName} representative photo`,
      source: 'pexels' as const,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url
    };
  });

  const results = await Promise.allSettled(requests);
  const photos = results
    .filter(isFulfilled)
    .map((result) => result.value)
    .filter((photo): photo is NonNullable<typeof photo> => Boolean(photo?.url));

  return dedupePhotos(photos);
}

async function searchUnsplash(countryName: string): Promise<CountryPhoto[]> {
  // Optional fallback key in .env.local -> UNSPLASH_ACCESS_KEY
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    return [];
  }

  const requests = PHOTO_CATEGORY_QUERIES.map(async (category) => {
    const query = encodeURIComponent(`${countryName} ${category}`);
    const response = await fetchWithTimeout(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=landscape&client_id=${accessKey}`,
      {
        timeoutMs: 9000,
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {results?: UnsplashPhoto[]};
    const photo = payload.results?.[0];

    if (!photo?.urls?.regular) {
      return null;
    }

    return {
      id: `unsplash-${photo.id}`,
      url: photo.urls.regular,
      alt: photo.alt_description || `${countryName} representative photo`,
      source: 'unsplash' as const,
      photographer: photo.user?.name,
      photographerUrl: photo.user?.links?.html
    };
  });

  const results = await Promise.allSettled(requests);
  const photos = results
    .filter(isFulfilled)
    .map((result) => result.value)
    .filter((photo): photo is NonNullable<typeof photo> => Boolean(photo?.url));

  return dedupePhotos(photos);
}

function dedupePhotos(items: CountryPhoto[]) {
  const seen = new Set<string>();
  const unique: CountryPhoto[] = [];

  for (const item of items) {
    if (seen.has(item.url)) {
      continue;
    }
    seen.add(item.url);
    unique.push(item);
  }

  return unique.slice(0, 4);
}

export async function getCountryPhotos(countryName: string, iso2: string): Promise<CountryPhoto[]> {
  const pexels = await searchPexels(countryName);
  if (pexels.length >= 3) {
    return pexels;
  }

  const unsplash = await searchUnsplash(countryName);
  const merged = dedupePhotos([...pexels, ...unsplash]);

  if (merged.length >= 3) {
    return merged;
  }

  return fallbackCountryPhotos[iso2] ?? fallbackCountryPhotos.US;
}
