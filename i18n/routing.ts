import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ko', 'fr', 'de', 'ja', 'zh-CN', 'es', 'pt', 'it', 'nl', 'ar', 'hi', 'tr', 'ru', 'vi', 'th', 'id'],
  defaultLocale: 'en',
  localeDetection: true
});

export type AppLocale = (typeof routing.locales)[number];
