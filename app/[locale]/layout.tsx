import {notFound} from 'next/navigation';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {AppShell} from '@/components/app-shell';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AppShell>{children}</AppShell>
    </NextIntlClientProvider>
  );
}
