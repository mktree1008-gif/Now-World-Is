'use client';

import {useMemo} from 'react';
import {zoomIdentity} from 'd3-zoom';
import {LocateFixed} from 'lucide-react';
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
    <div className="map-shell relative h-[58vh] min-h-[420px] overflow-hidden rounded-2xl border border-[#2b3f5f] bg-[#0a1323]">
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
        <button
          type="button"
          className="h-10 w-10 rounded-lg border border-[#2f4566] bg-[#132238]/90 text-xl text-nwi-text transition hover:border-cyan-300/40 hover:text-cyan-100"
          onClick={() => {
            const nextZoom = zoomIdentity.scale(viewState.zoom + 0.25).k;
            onViewStateChange({center: viewState.center, zoom: Math.min(nextZoom, 6)});
          }}
        >
          +
        </button>
        <button
          type="button"
          className="h-10 w-10 rounded-lg border border-[#2f4566] bg-[#132238]/90 text-xl text-nwi-text transition hover:border-cyan-300/40 hover:text-cyan-100"
          onClick={() => {
            const nextZoom = zoomIdentity.scale(viewState.zoom - 0.25).k;
            onViewStateChange({center: viewState.center, zoom: Math.max(nextZoom, 1)});
          }}
        >
          -
        </button>
        <button
          type="button"
          className="h-10 w-10 rounded-lg border border-[#2f4566] bg-[#132238]/90 text-nwi-text transition hover:border-cyan-300/40 hover:text-cyan-100"
          onClick={() => onViewStateChange({center: [8, 18], zoom: 1.08})}
          aria-label="Reset map position"
        >
          <LocateFixed className="mx-auto h-4 w-4" />
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
                        fill: isSelected ? '#54cdef' : isHovered ? '#3174a8' : hasData ? '#203c61' : '#142238',
                        stroke: isSelected ? '#d6f5ff' : '#35557b',
                        strokeWidth: isSelected ? 1.3 : 0.55,
                        outline: 'none'
                      },
                      hover: {
                        fill: '#54cdef',
                        stroke: '#d9f5ff',
                        strokeWidth: 1.2,
                        outline: 'none'
                      },
                      pressed: {
                        fill: '#7ee0ff',
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
