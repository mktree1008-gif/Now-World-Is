import {cookies, headers} from 'next/headers';
import {redirect} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {resolveLocaleFromAcceptLanguage} from '@/lib/i18n/resolve-locale';

export default async function RootPage() {
  const cookieStore = await cookies();
  const preferred = cookieStore.get('NWI_LOCALE')?.value;
  if (preferred && routing.locales.includes(preferred as (typeof routing.locales)[number])) {
    redirect(`/${preferred}`);
  }

  const headerStore = await headers();
  const acceptLanguage = headerStore.get('accept-language');
  const locale = resolveLocaleFromAcceptLanguage(acceptLanguage);
  redirect(`/${locale}`);
}
