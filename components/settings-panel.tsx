'use client';

import {useLocale, useTranslations} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';
import {useSearchParams} from 'next/navigation';
import {localeLabels} from '@/lib/locales';
import {routing} from '@/i18n/routing';
import type {SupportedLocale} from '@/lib/types';

export function SettingsPanel() {
  const t = useTranslations('settings');
  const locale = useLocale() as SupportedLocale;
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <section className="nwi-panel rounded-2xl p-4">
      <h1 className="text-xl font-semibold">{t('title')}</h1>
      <p className="mt-1 text-sm text-nwi-muted">{t('description')}</p>

      <div className="mt-4 max-w-sm">
        <label className="mb-2 block text-sm text-nwi-muted">{t('preferredLanguage')}</label>
        <select
          value={locale}
          onChange={(event) => {
            const nextLocale = event.target.value as SupportedLocale;
            document.cookie = `NWI_LOCALE=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
            const suffix = searchParams.toString();
            const target = suffix ? `${pathname}?${suffix}` : pathname;
            router.replace(target, {locale: nextLocale});
          }}
          className="w-full rounded-lg border border-nwi-border bg-[#0a1524] px-3 py-2 text-sm"
        >
          {routing.locales.map((item) => (
            <option key={item} value={item}>
              {localeLabels[item as SupportedLocale]}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
