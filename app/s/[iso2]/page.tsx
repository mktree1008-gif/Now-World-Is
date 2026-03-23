import {cookies, headers} from 'next/headers';
import {redirect} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {resolveLocaleFromAcceptLanguage} from '@/lib/i18n/resolve-locale';

export default async function FixedCountrySharePage({
  params
}: {
  params: Promise<{iso2: string}>;
}) {
  const {iso2} = await params;
  const normalizedIso2 = iso2.toUpperCase();

  const cookieStore = await cookies();
  const preferred = cookieStore.get('NWI_LOCALE')?.value;
  const locale = routing.locales.includes(preferred as (typeof routing.locales)[number])
    ? preferred
    : resolveLocaleFromAcceptLanguage((await headers()).get('accept-language'));

  redirect(`/${locale}/country/${normalizedIso2.toLowerCase()}`);
}

