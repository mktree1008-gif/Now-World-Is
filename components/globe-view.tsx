'use client';

import dynamic from 'next/dynamic';
import {useEffect, useMemo, useRef, useState} from 'react';
import type {GlobeMethods} from 'react-globe.gl';
import type {CountrySummary} from '@/lib/types';
import {WORLD_GEO_URL} from '@/lib/constants';
import {resolveIso2FromGeo} from '@/lib/utils/country';

const Globe = dynamic(() => import('react-globe.gl'), {ssr: false});

type GeoFeature = {
  type: 'Feature';
  properties: Record<string, string>;
  id?: string | number;
  geometry: unknown;
};

type Props = {
  countries: CountrySummary[];
  hoveredIso2: string | null;
  selectedIso2: string | null;
  onHover: (iso2: string | null, x: number, y: number) => void;
  onSelect: (iso2: string) => void;
};

export function GlobeView({countries, hoveredIso2, selectedIso2, onHover, onSelect}: Props) {
  const globeRef = useRef<GlobeMethods>();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef<{x: number; y: number}>({x: 0, y: 0});
  const [features, setFeatures] = useState<GeoFeature[]>([]);
  const [autoRotateSpeed, setAutoRotateSpeed] = useState(0.3);
  const swipeStart = useRef<{x: number; at: number} | null>(null);

  useEffect(() => {
    fetch(WORLD_GEO_URL, {cache: 'force-cache'})
      .then((response) => response.json())
      .then((data: {features?: GeoFeature[]}) => setFeatures(data.features ?? []))
      .catch(() => setFeatures([]));
  }, []);

  useEffect(() => {
    const controls = globeRef.current?.controls?.();
    if (!controls) {
      return;
    }

    controls.autoRotate = true;
    controls.autoRotateSpeed = autoRotateSpeed;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 120;
    controls.maxDistance = 420;
  }, [autoRotateSpeed]);

  const selectedSet = useMemo(() => new Set([selectedIso2, hoveredIso2].filter(Boolean)), [selectedIso2, hoveredIso2]);

  return (
    <div
      ref={wrapperRef}
      className="map-shell relative h-[58vh] min-h-[420px] overflow-hidden rounded-2xl border border-nwi-border"
      onPointerMove={(event) => {
        pointerRef.current = {x: event.clientX, y: event.clientY};
      }}
      onPointerDown={(event) => {
        swipeStart.current = {x: event.clientX, at: Date.now()};
      }}
      onPointerUp={(event) => {
        if (!swipeStart.current) {
          return;
        }

        const dx = event.clientX - swipeStart.current.x;
        const dt = Date.now() - swipeStart.current.at;
        const velocity = Math.min(Math.abs(dx) / Math.max(dt, 1), 2.2);
        const next = Math.max(0.25, velocity * 1.6);
        setAutoRotateSpeed(next);

        window.setTimeout(() => {
          setAutoRotateSpeed(0.3);
        }, 1800);

        swipeStart.current = null;
      }}
    >
      <Globe
        ref={globeRef}
        width={wrapperRef.current?.clientWidth ?? 900}
        height={wrapperRef.current?.clientHeight ?? 560}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
        polygonsData={features}
        polygonCapColor={(feature: object) => {
          const iso2 = resolveIso2FromGeo(feature as GeoFeature, countries);

          if (iso2 && selectedSet.has(iso2)) {
            return 'rgba(102, 217, 255, 0.85)';
          }

          if (iso2) {
            return 'rgba(46, 106, 161, 0.65)';
          }

          return 'rgba(22, 35, 53, 0.5)';
        }}
        polygonSideColor={() => 'rgba(10, 20, 35, 0.45)'}
        polygonStrokeColor={() => 'rgba(137, 181, 219, 0.35)'}
        polygonAltitude={(feature: object) => {
          const iso2 = resolveIso2FromGeo(feature as GeoFeature, countries);
          if (iso2 && selectedSet.has(iso2)) {
            return 0.014;
          }
          return 0.005;
        }}
        onPolygonHover={(feature: object | null) => {
          const iso2 = feature ? resolveIso2FromGeo(feature as GeoFeature, countries) : undefined;
          onHover(iso2 ?? null, pointerRef.current.x, pointerRef.current.y);
        }}
        onPolygonClick={(feature: object) => {
          const iso2 = resolveIso2FromGeo(feature as GeoFeature, countries);
          if (iso2) {
            onSelect(iso2);
          }
        }}
      />
    </div>
  );
}
