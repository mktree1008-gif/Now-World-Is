'use client';

import {GitCompareArrows, Heart, Map, Settings, UserRound} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {LanguageSwitcher} from '@/components/language-switcher';
import {AuthControls} from '@/components/auth-controls';
import {GlobalCountrySearch} from '@/components/global-country-search';

export function TopBar() {
  const t = useTranslations('common');

  return (
    <header className="sticky top-0 z-50 border-b border-[#1f3048] bg-[#060d1a]/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full items-center gap-4 px-4 py-3 md:px-6">
        <Link href={{pathname: '/'}} className="shrink-0 text-[1.55rem] font-semibold tracking-[-0.02em] text-cyan-300">
          NWI
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            href={{pathname: '/'}}
            className="inline-flex items-center gap-2 rounded-lg border-b-2 border-cyan-300 px-3 py-1.5 text-sm font-medium text-cyan-200"
          >
            <Map className="h-4 w-4" />
            <span>{t('map')}</span>
          </Link>
          <Link
            href={{pathname: '/favorites'}}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-nwi-muted transition hover:bg-white/5 hover:text-nwi-text"
          >
            <Heart className="h-4 w-4" />
            <span>{t('favorites')}</span>
          </Link>
          <Link
            href={{pathname: '/compare'}}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-nwi-muted transition hover:bg-white/5 hover:text-nwi-text"
          >
            <GitCompareArrows className="h-4 w-4" />
            <span>{t('compare')}</span>
          </Link>
          <Link
            href={{pathname: '/profile'}}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-nwi-muted transition hover:bg-white/5 hover:text-nwi-text"
          >
            <UserRound className="h-4 w-4" />
            <span>{t('profile')}</span>
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <GlobalCountrySearch />
          <LanguageSwitcher />
          <Link
            href={{pathname: '/settings'}}
            aria-label={t('settings')}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#2f415d] bg-[#0a1220]/90 text-nwi-muted hover:border-[#4b6b97] hover:text-nwi-text"
          >
            <Settings className="h-4 w-4" />
          </Link>
          <AuthControls />
        </div>
      </div>
    </header>
  );
}
