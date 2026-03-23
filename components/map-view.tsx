'use client';

import {useMemo} from 'react';
import {zoomIdentity} from 'd3-zoom';
import {ComposableMap, Geographies, Geography, ZoomableGroup} from 'react-simple-maps';
import type {CountrySummary} from '@/lib/types';
import {WORLD_GEO_URL} from '@/lib/constants';
import {resolveIso2FromGeo} from '@/lib/utils/country';

type Props = {
  countries: CountrySummary[];
  hoveredIso2: string | null;
  selectedIso2: string | null;
  onHover: (iso2: string | null, x: number, y: number) => void;
  onSelect: (iso2: string) => void;
  viewState: {center: [number, number]; zoom: number};
  onViewStateChange: (next: {center: [number, number]; zoom: number}) => void;
};

export function MapView({
  countries,
  hoveredIso2,
  selectedIso2,
  onHover,
  onSelect,
  viewState,
  onViewStateChange
}: Props) {
  const mapByIso2 = useMemo(() => new Map(countries.map((country) => [country.iso2, country])), [countries]);

  return (
    <div className="map-shell relative h-[58vh] min-h-[420px] overflow-hidden rounded-2xl border border-nwi-border">
      <div className="absolute bottom-4 left-4 z-20 flex gap-2">
        <button
          type="button"
          className="rounded-md border border-nwi-border bg-[#0a1320]/90 px-2 py-1 text-sm"
          onClick={() => {
            const nextZoom = zoomIdentity.scale(viewState.zoom + 0.25).k;
            onViewStateChange({center: viewState.center, zoom: Math.min(nextZoom, 6)});
          }}
        >
          +
        </button>
        <button
          type="button"
          className="rounded-md border border-nwi-border bg-[#0a1320]/90 px-2 py-1 text-sm"
          onClick={() => {
            const nextZoom = zoomIdentity.scale(viewState.zoom - 0.25).k;
            onViewStateChange({center: viewState.center, zoom: Math.max(nextZoom, 1)});
          }}
        >
          -
        </button>
      </div>

      <ComposableMap projection="geoEqualEarth" className="h-full w-full">
        <ZoomableGroup
          zoom={viewState.zoom}
          center={viewState.center}
          onMoveEnd={(position) => {
            onViewStateChange({
              center: position.coordinates as [number, number],
              zoom: position.zoom
            });
          }}
        >
          <Geographies geography={WORLD_GEO_URL}>
            {({geographies}) =>
              geographies.map((geo) => {
                const iso2 = resolveIso2FromGeo(geo as unknown as {id?: string | number; properties?: Record<string, unknown>}, countries);
                const isSelected = iso2 ? selectedIso2 === iso2 : false;
                const isHovered = iso2 ? hoveredIso2 === iso2 : false;
                const hasData = iso2 ? mapByIso2.has(iso2) : false;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    tabIndex={0}
                    onMouseEnter={(event) => {
                      if (!iso2) {
                        return;
                      }
                      onHover(iso2, event.clientX, event.clientY);
                    }}
                    onMouseMove={(event) => {
                      if (!iso2) {
                        return;
                      }
                      onHover(iso2, event.clientX, event.clientY);
                    }}
                    onMouseLeave={() => onHover(null, 0, 0)}
                    onFocus={(event) => {
                      if (!iso2) {
                        return;
                      }
                      const rect = (event.target as SVGPathElement).getBoundingClientRect();
                      onHover(iso2, rect.left + rect.width / 2, rect.top + 10);
                    }}
                    onBlur={() => onHover(null, 0, 0)}
                    onClick={() => {
                      if (!iso2) {
                        return;
                      }
                      onSelect(iso2);
                    }}
                    style={{
                      default: {
                        fill: isSelected ? '#67d5ff' : isHovered ? '#4eb8df' : hasData ? '#1f3b5e' : '#142338',
                        stroke: isSelected ? '#def5ff' : '#35587a',
                        strokeWidth: isSelected ? 1.4 : 0.6,
                        outline: 'none'
                      },
                      hover: {
                        fill: '#67d5ff',
                        stroke: '#e3f6ff',
                        strokeWidth: 1.2,
                        outline: 'none'
                      },
                      pressed: {
                        fill: '#8ee4ff',
                        stroke: '#ffffff',
                        strokeWidth: 1.3,
                        outline: 'none'
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
