import {routing} from '@/i18n/routing';

export function resolveLocaleFromAcceptLanguage(headerValue: string | null) {
  if (!headerValue) {
    return routing.defaultLocale;
  }

  const ranked = headerValue
    .split(',')
    .map((part) => {
      const [tag, qValue] = part.trim().split(';q=');
      const quality = qValue ? Number(qValue) : 1;
      return {tag: tag.toLowerCase(), quality: Number.isFinite(quality) ? quality : 1};
    })
    .sort((a, b) => b.quality - a.quality);

  for (const entry of ranked) {
    const exact = routing.locales.find((locale) => locale.toLowerCase() === entry.tag);
    if (exact) {
      return exact;
    }

    const base = entry.tag.split('-')[0];
    const partial = routing.locales.find((locale) => locale.toLowerCase().startsWith(base));
    if (partial) {
      return partial;
    }
  }

  return routing.defaultLocale;
}

