'use client';

import {useMemo, useState} from 'react';
import {
  Archive,
  ArrowLeftRight,
  Download,
  History,
  Landmark,
  LifeBuoy,
  TrendingUp,
  Users2
} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import type {CountrySummary} from '@/lib/types';
import {CountrySearch} from '@/components/country-search';
import {MapGlobeToggle} from '@/components/map-globe-toggle';
import {MapView} from '@/components/map-view';
import {GlobeView} from '@/components/globe-view';
import {CountryTooltip} from '@/components/country-tooltip';
import {CountryDetailDrawer} from '@/components/country-detail-drawer';
import {useCountryGrowth} from '@/lib/hooks/use-country-growth';

type Lens = 'profile' | 'demographics' | 'economics' | 'politics' | 'history' | 'trade';

export function WorldExplorer({
  locale,
  countries,
  initialView,
  initialCountryIso2,
  initialCenter,
  initialZoom
}: {
  locale: string;
  countries: CountrySummary[];
  initialView: 'map' | 'globe';
  initialCountryIso2: string | null;
  initialCenter: [number, number];
  initialZoom: number;
}) {
  const tCommon = useTranslations('common');
  const tMap = useTranslations('map');
  const tCountry = useTranslations('country');
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [view, setView] = useState<'map' | 'globe'>(initialView);
  const [selectedIso2, setSelectedIso2] = useState<string | null>(initialCountryIso2);
  const [hoverState, setHoverState] = useState<{iso2: string | null; x: number; y: number}>({
    iso2: null,
    x: 0,
    y: 0
  });
  const [activeLens, setActiveLens] = useState<Lens>('profile');
  const [mapState, setMapState] = useState<{center: [number, number]; zoom: number}>({
    center: initialCenter,
    zoom: initialZoom
  });

  const selectedSummary = useMemo(
    () => countries.find((country) => country.iso2 === selectedIso2) ?? null,
    [countries, selectedIso2]
  );
  const hoverSummary = useMemo(
    () => countries.find((country) => country.iso2 === hoverState.iso2) ?? null,
    [countries, hoverState.iso2]
  );

  const growthTargetIso2 = selectedIso2 ?? hoverState.iso2;
  const {data: growthData} = useCountryGrowth(growthTargetIso2, locale);
  const growth = growthData?.gdpGrowth ?? growthData?.pppGrowth ?? null;

  const updateQuery = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => {
      if (!value) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });

    const suffix = next.toString();
    router.replace(suffix ? `${pathname}?${suffix}` : pathname, {scroll: false});
  };

  const lensItems: Array<{id: Lens; label: string; icon: typeof Users2}> = [
    {id: 'profile', label: 'Country Profile', icon: Landmark},
    {id: 'demographics', label: tCountry('demographics'), icon: Users2},
    {id: 'economics', label: tCountry('economy'), icon: TrendingUp},
    {id: 'politics', label: tCountry('politics'), icon: Landmark},
    {id: 'history', label: tCountry('history'), icon: History},
    {id: 'trade', label: 'Trade', icon: ArrowLeftRight}
  ];

  const layerChips: Array<{id: Lens; label: string}> = [
    {id: 'economics', label: 'GDP Layers'},
    {id: 'trade', label: 'Trade Flows'},
    {id: 'demographics', label: 'Demographics'}
  ];

  return (
    <div className="space-y-3">
      <div className="grid gap-4 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="hidden h-[calc(100vh-7.4rem)] flex-col overflow-hidden rounded-2xl border border-[#1f3048] bg-[#101a2f] lg:flex">
          <div className="border-b border-white/5 px-5 py-5">
            <div className="mb-1 flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm bg-cyan-500/25 text-cyan-200">
                <Landmark className="h-4 w-4" />
              </span>
              <p className="text-lg font-semibold tracking-tight">Country Profile</p>
            </div>
            <p className="text-xs text-nwi-muted">Regional Intelligence</p>
          </div>

          <nav className="space-y-1 px-3 py-4">
            {lensItems.map((item) => {
              const Icon = item.icon;
              const active = activeLens === item.id;

              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setActiveLens(item.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                    active
                      ? 'bg-cyan-500/15 text-cyan-100'
                      : 'text-nwi-muted hover:translate-x-0.5 hover:bg-white/5 hover:text-nwi-text'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="px-4 pb-4">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-500 px-3 py-2.5 text-xs font-semibold tracking-[0.14em] text-[#012028]">
              <Download className="h-3.5 w-3.5" />
              EXPORT DATA
            </button>
          </div>

          <div className="mt-auto border-t border-white/5 px-3 py-3">
            <button className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-nwi-muted hover:bg-white/5 hover:text-nwi-text">
              <LifeBuoy className="h-4 w-4" />
              Support
            </button>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-nwi-muted hover:bg-white/5 hover:text-nwi-text">
              <Archive className="h-4 w-4" />
              Archive
            </button>
          </div>
        </aside>

        <section className="relative overflow-hidden rounded-2xl border border-[#1f3048] bg-[#0c1426]">
          <div className="intel-grid pointer-events-none absolute inset-0 opacity-60" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_70%_at_10%_15%,rgba(76,215,246,0.12),transparent_55%),radial-gradient(60%_40%_at_90%_20%,rgba(76,215,246,0.08),transparent_62%)]" />

          <div className="relative z-10 p-4 md:p-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <MapGlobeToggle
                view={view}
                labels={{map: tCommon('map'), globe: tCommon('globe')}}
                onChange={(nextView) => {
                  setView(nextView);
                  updateQuery({view: nextView});
                }}
              />
              <CountrySearch
                countries={countries}
                placeholder={tCommon('searchPlaceholder')}
                onPick={(country) => {
                  setSelectedIso2(country.iso2);
                  updateQuery({country: country.iso2});
                }}
              />
            </div>

            <p className="mb-3 text-sm text-[#9cb0cc]">{tMap('hoverHint')}</p>

            <div className="relative">
              {view === 'map' ? (
                <MapView
                  countries={countries}
                  hoveredIso2={hoverState.iso2}
                  selectedIso2={selectedIso2}
                  onHover={(iso2, x, y) => setHoverState({iso2, x, y})}
                  onSelect={(iso2) => {
                    setSelectedIso2(iso2);
                    updateQuery({country: iso2});
                  }}
                  viewState={mapState}
                  onViewStateChange={(nextState) => {
                    setMapState(nextState);
                    updateQuery({
                      zoom: nextState.zoom.toFixed(2),
                      lng: nextState.center[0].toFixed(2),
                      lat: nextState.center[1].toFixed(2)
                    });
                  }}
                />
              ) : (
                <GlobeView
                  countries={countries}
                  hoveredIso2={hoverState.iso2}
                  selectedIso2={selectedIso2}
                  onHover={(iso2, x, y) => setHoverState({iso2, x, y})}
                  onSelect={(iso2) => {
                    setSelectedIso2(iso2);
                    updateQuery({country: iso2});
                  }}
                />
              )}

              <div className="absolute right-4 top-4 hidden w-52 rounded-xl border border-[#2f415d] bg-[#132036]/80 p-4 backdrop-blur-md lg:block">
                <h4 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#95a8c5]">Intelligence Scale</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[#9eb2cd]">
                    <span>High Growth</span>
                    <span className="font-semibold text-cyan-300">
                      {growth ? `${growth.value >= 0 ? '+' : ''}${growth.value.toFixed(1)}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#0d1729]">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400/25 via-cyan-300 to-cyan-400"
                      style={{
                        width: `${Math.max(18, Math.min(100, growth ? Math.abs(growth.value) * 12 : 22))}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-semibold tracking-[0.08em] text-[#7588a5]">
                    <span>STAGNANT</span>
                    <span>BOOMING</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {layerChips.map((chip) => {
                const active = activeLens === chip.id;
                return (
                  <button
                    type="button"
                    key={chip.id}
                    onClick={() => setActiveLens(chip.id)}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition ${
                      active
                        ? 'border-cyan-400/40 bg-[#13243c] text-cyan-100'
                        : 'border-[#2a3c5a] bg-[#0d1729]/90 text-[#8ea3c0] hover:border-[#3f5a83]'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${active ? 'bg-cyan-300' : 'bg-[#607698]'}`} />
                    {chip.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 text-xs text-[#8fa4c0]">{tMap('sourceNote')}</div>
          </div>
        </section>
      </div>

      <div className="flex gap-2 overflow-x-auto rounded-xl border border-[#1f3048] bg-[#111b30] p-2 lg:hidden">
        {lensItems.map((item) => {
          const Icon = item.icon;
          const active = activeLens === item.id;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => setActiveLens(item.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                active ? 'bg-cyan-500/20 text-cyan-100' : 'bg-[#0a1426] text-nwi-muted'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>

      {hoverSummary ? (
        <CountryTooltip
          summary={hoverSummary}
          locale={locale}
          x={hoverState.x}
          y={hoverState.y}
          labels={{
            gdp: tMap('tooltipGdp'),
            ppp: tMap('tooltipPpp'),
            year: tMap('tooltipYear'),
            avgIq: tMap('avgIq')
          }}
        />
      ) : null}

      <CountryDetailDrawer
        open={Boolean(selectedSummary)}
        summary={selectedSummary}
        locale={locale}
        activeLens={activeLens}
        onClose={() => {
          setSelectedIso2(null);
          updateQuery({country: null});
        }}
      />
    </div>
  );
}
