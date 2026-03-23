import type {Metadata} from 'next';
import {Inter, Noto_Sans} from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700']
});

const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nwi.world'),
  title: 'Now world is (NWI)',
  description: 'Premium global intelligence atlas with multilingual map and globe views.',
  alternates: {
    canonical: 'https://nwi.world'
  }
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
