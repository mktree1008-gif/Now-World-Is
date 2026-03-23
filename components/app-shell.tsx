import {TopBar} from '@/components/top-bar';

export function AppShell({children}: {children: React.ReactNode}) {
  return (
    <div className="min-h-screen bg-transparent text-nwi-text">
      <TopBar />
      <main className="mx-auto w-full px-3 pb-8 pt-4 md:px-6 md:pt-5">{children}</main>
    </div>
  );
}
