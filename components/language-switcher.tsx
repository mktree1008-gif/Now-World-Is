'use client';

import {useTransition} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {routing} from '@/i18n/routing';
import {usePathname, useRouter} from '@/i18n/navigation';
import {useSearchParams} from 'next/navigation';
import type {SupportedLocale} from '@/lib/types';
import {localeLabels} from '@/lib/locales';

export function LanguageSwitcher() {
  const t = useTranslations('common');
  const locale = useLocale() as SupportedLocale;
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  return (
    <label className="inline-flex items-center gap-2 text-xs text-nwi-muted">
      <span className="hidden md:inline">{t('language')}</span>
      <select
        aria-label={t('language')}
        className="rounded-md border border-nwi-border bg-nwi-panel px-2 py-1 text-sm text-nwi-text"
        value={locale}
        disabled={pending}
        onChange={(event) => {
          const nextLocale = event.target.value as SupportedLocale;
          document.cookie = `NWI_LOCALE=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;

          startTransition(() => {
            const suffix = searchParams.toString();
            const target = suffix ? `${pathname}?${suffix}` : pathname;
            router.replace(target, {locale: nextLocale});
          });
        }}
      >
        {routing.locales.map((item) => (
          <option key={item} value={item}>
            {localeLabels[item as SupportedLocale]}
          </option>
        ))}
      </select>
    </label>
  );
}
