'use client';

import {useTransition} from 'react';
import {ChevronDown, Languages} from 'lucide-react';
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
    <label className="relative inline-flex items-center gap-2 rounded-lg border border-[#2f415d] bg-[#0a1220]/90 px-2.5 py-1.5 text-xs text-nwi-muted hover:border-[#3e5b84]">
      <Languages className="h-4 w-4 text-cyan-300" />
      <select
        aria-label={t('language')}
        className="appearance-none bg-transparent pr-5 text-sm text-nwi-text outline-none"
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
      <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-nwi-muted" />
    </label>
  );
}
