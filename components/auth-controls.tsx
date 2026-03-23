'use client';

import {useState} from 'react';
import {LogIn, LogOut, UserRound} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useAuth} from '@/lib/hooks/use-auth';
import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/utils/cn';

export function AuthControls() {
  const t = useTranslations('common');
  const {user, signInWithGoogle, signInWithMagicLink, signOut, loading} = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  if (loading) {
    return <span className="text-xs text-nwi-muted">...</span>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href={{pathname: '/profile'}}
          className="inline-flex items-center gap-1 rounded-md border border-nwi-border bg-nwi-panel px-3 py-1.5 text-sm hover:border-sky-400"
        >
          <UserRound className="h-4 w-4" />
          <span className="max-w-[9rem] truncate">{user.email ?? t('profile')}</span>
        </Link>
        <button
          type="button"
          onClick={() => signOut()}
          className="inline-flex items-center gap-1 rounded-md border border-nwi-border px-2 py-1.5 text-sm text-nwi-muted hover:text-nwi-text"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden md:inline">{t('logout')}</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-w-[92px] items-center justify-center gap-1 whitespace-nowrap rounded-md border border-nwi-border bg-nwi-panel px-3 py-1.5 text-sm hover:border-sky-400"
      >
        <LogIn className="h-4 w-4" />
        <span className="whitespace-nowrap">{t('login')}</span>
      </button>

      <div
        className={cn(
          'fixed inset-0 z-50 transition',
          open ? 'pointer-events-auto bg-black/60 opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="nwi-panel w-full max-w-md rounded-2xl p-5">
            <h3 className="mb-4 text-lg font-semibold text-nwi-text">{t('login')}</h3>
            <button
              type="button"
              onClick={() => signInWithGoogle()}
              className="mb-3 w-full rounded-md border border-sky-400/60 bg-sky-500/15 px-4 py-2 text-sm font-medium text-sky-200"
            >
              Continue with Google
            </button>
            <form
              className="space-y-2"
              onSubmit={async (event) => {
                event.preventDefault();
                if (!email) {
                  return;
                }
                const result = await signInWithMagicLink(email);
                setMessage(result.error ?? 'Magic link sent. Check your inbox.');
              }}
            >
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-md border border-nwi-border bg-[#08101a] px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="w-full rounded-md border border-nwi-border bg-nwi-panelSoft px-4 py-2 text-sm"
              >
                Send magic link
              </button>
            </form>
            {message ? <p className="mt-3 text-xs text-nwi-muted">{message}</p> : null}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full rounded-md border border-nwi-border px-3 py-2 text-sm text-nwi-muted"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
