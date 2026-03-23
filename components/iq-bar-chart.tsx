'use client';

import type {CountryEconomicSeries} from '@/lib/types';

export function IQBarChart({data}: {data: CountryEconomicSeries[]}) {
  const values = data.filter((item) => item.averageIq !== null);

  if (!values.length) {
    return <p className="text-sm text-nwi-muted">IQ data unavailable.</p>;
  }

  const max = Math.max(...values.map((item) => item.averageIq ?? 0), 1);

  return (
    <div className="space-y-2">
      {values.map((item) => (
        <div key={item.iso2} className="rounded-lg border border-nwi-border bg-[#0a1524] p-2">
          <div className="mb-1 flex items-center justify-between text-xs text-nwi-muted">
            <span>{item.countryName}</span>
            <span>
              {item.averageIq} {item.averageIqYear ? `(${item.averageIqYear})` : ''}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#12283f]">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-200" style={{width: `${((item.averageIq ?? 0) / max) * 100}%`}} />
          </div>
          {item.averageIqSource ? <p className="mt-1 text-[11px] text-nwi-muted/80">{item.averageIqSource}</p> : null}
        </div>
      ))}
    </div>
  );
}
