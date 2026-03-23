'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {useAuth} from '@/lib/hooks/use-auth';

export function ProfilePanel() {
  const t = useTranslations('profile');
  const common = useTranslations('common');
  const {user, signOut} = useAuth();

  return (
    <section className="nwi-panel rounded-2xl p-4">
      <h1 className="text-xl font-semibold">{t('title')}</h1>
      <p className="mt-2 text-sm text-nwi-muted">{user ? `${t('signedInAs')}: ${user.email}` : t('notSignedIn')}</p>

      <div className="mt-4 grid gap-2 md:grid-cols-3">
        <Link href={{pathname: '/settings'}} className="rounded-lg border border-nwi-border bg-[#0a1524] px-3 py-2 text-sm">
          {common('settings')}
        </Link>
        <Link href={{pathname: '/favorites'}} className="rounded-lg border border-nwi-border bg-[#0a1524] px-3 py-2 text-sm">
          {common('favorites')}
        </Link>
        <Link href={{pathname: '/compare'}} className="rounded-lg border border-nwi-border bg-[#0a1524] px-3 py-2 text-sm">
          {common('compare')}
        </Link>
      </div>

      {user ? (
        <button
          type="button"
          onClick={() => signOut()}
          className="mt-4 rounded-lg border border-nwi-border px-3 py-2 text-sm text-nwi-muted"
        >
          {common('logout')}
        </button>
      ) : null}
    </section>
  );
}
