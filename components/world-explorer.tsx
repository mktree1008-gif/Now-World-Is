'use client';

import {useMemo, useState} from 'react';
import {useTranslations} from 'next-intl';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import type {CountrySummary} from '@/lib/types';
import {CountrySearch} from '@/components/country-search';
import {MapGlobeToggle} from '@/components/map-globe-toggle';
import {MapView} from '@/components/map-view';
import {GlobeView} from '@/components/globe-view';
import {CountryTooltip} from '@/components/country-tooltip';
import {CountryDetailDrawer} from '@/components/country-detail-drawer';

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

  return (
    <div className="space-y-3">
      <div className="nwi-panel rounded-2xl p-3 md:p-4">
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

        <p className="mb-3 text-xs text-nwi-muted">{tMap('hoverHint')}</p>

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

        <div className="mt-3 text-xs text-nwi-muted">{tMap('sourceNote')}</div>
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
        onClose={() => {
          setSelectedIso2(null);
          updateQuery({country: null});
        }}
      />
    </div>
  );
}
