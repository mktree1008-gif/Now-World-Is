'use client';

import {GitCompareArrows, Heart, Settings2, UserRound} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {LanguageSwitcher} from '@/components/language-switcher';
import {AuthControls} from '@/components/auth-controls';
import {GlobalCountrySearch} from '@/components/global-country-search';

export function TopBar() {
  const t = useTranslations('common');

  return (
    <header className="sticky top-0 z-40 border-b border-nwi-border bg-[#050b13]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1440px] items-center gap-3 px-3 py-3 md:px-6">
        <Link href={{pathname: '/'}} className="mr-2 shrink-0 text-sm font-semibold tracking-[0.22em] text-cyan-200">
          NWI_2026
        </Link>
        <GlobalCountrySearch />

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <Link
            href={{pathname: '/favorites'}}
            className="inline-flex items-center gap-1 rounded-md border border-nwi-border px-2 py-1.5 text-xs text-nwi-muted hover:text-nwi-text"
          >
            <Heart className="h-4 w-4" />
            <span className="hidden md:inline">{t('favorites')}</span>
          </Link>
          <Link
            href={{pathname: '/compare'}}
            className="inline-flex items-center gap-1 rounded-md border border-nwi-border px-2 py-1.5 text-xs text-nwi-muted hover:text-nwi-text"
          >
            <GitCompareArrows className="h-4 w-4" />
            <span className="hidden md:inline">{t('compare')}</span>
          </Link>
          <Link
            href={{pathname: '/settings'}}
            className="inline-flex items-center gap-1 rounded-md border border-nwi-border px-2 py-1.5 text-xs text-nwi-muted hover:text-nwi-text"
          >
            <Settings2 className="h-4 w-4" />
            <span className="hidden md:inline">{t('settings')}</span>
          </Link>
          <Link
            href={{pathname: '/profile'}}
            className="inline-flex items-center gap-1 rounded-md border border-nwi-border px-2 py-1.5 text-xs text-nwi-muted hover:text-nwi-text"
          >
            <UserRound className="h-4 w-4" />
            <span className="hidden md:inline">{t('profile')}</span>
          </Link>
          <LanguageSwitcher />
          <AuthControls />
        </div>
      </div>
    </header>
  );
}
