'use client';

import type {CountryEconomicSeries, CompareMetric} from '@/lib/types';

const palette = ['#67d5ff', '#8df5c6', '#d9b878', '#f59bb0', '#b6a8ff', '#8cb9ff'];

export function MetricLineChart({
  data,
  metric,
  locale
}: {
  data: CountryEconomicSeries[];
  metric: Exclude<CompareMetric, 'averageIq'>;
  locale: string;
}) {
  const yearSet = new Set<number>();
  data.forEach((country) => {
    country[metric].forEach((point) => yearSet.add(point.year));
  });
  const years = [...yearSet].sort((a, b) => a - b);

  if (!years.length) {
    return <p className="text-sm text-nwi-muted">No time-series data available.</p>;
  }

  const width = 760;
  const height = 280;
  const padding = 38;

  const values = data.flatMap((country) => country[metric].map((point) => point.value).filter((value): value is number => value !== null));

  if (!values.length) {
    return <p className="text-sm text-nwi-muted">No numeric values available.</p>;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);

  const x = (year: number) => {
    if (years.length === 1) {
      return width / 2;
    }
    return padding + ((year - years[0]) / (years[years.length - 1] - years[0])) * (width - padding * 2);
  };

  const y = (value: number) => height - padding - ((value - min) / range) * (height - padding * 2);

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[280px] min-w-[720px] w-full rounded-xl bg-[#0a1524]">
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#335473" strokeWidth="1" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#335473" strokeWidth="1" />

        {years.map((year) => (
          <g key={year}>
            <line x1={x(year)} y1={height - padding} x2={x(year)} y2={height - padding + 6} stroke="#5c7ea0" strokeWidth="1" />
            <text x={x(year)} y={height - padding + 18} fill="#8da2be" fontSize="10" textAnchor="middle">
              {year}
            </text>
          </g>
        ))}

        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const value = min + range * ratio;
          const yPoint = y(value);
          return (
            <g key={ratio}>
              <line x1={padding} y1={yPoint} x2={width - padding} y2={yPoint} stroke="rgba(51,84,115,0.25)" strokeWidth="1" />
              <text x={padding - 8} y={yPoint + 4} fill="#8da2be" fontSize="10" textAnchor="end">
                {new Intl.NumberFormat(locale, {notation: 'compact', maximumFractionDigits: 1}).format(value)}
              </text>
            </g>
          );
        })}

        {data.map((country, idx) => {
          const map = new Map(country[metric].map((point) => [point.year, point.value]));
          const points = years
            .map((year) => {
              const value = map.get(year);
              if (value === null || value === undefined) {
                return null;
              }
              return `${x(year)},${y(value)}`;
            })
            .filter(Boolean)
            .join(' ');

          if (!points) {
            return null;
          }

          return (
            <g key={country.iso2}>
              <polyline
                points={points}
                fill="none"
                stroke={palette[idx % palette.length]}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {country[metric].map((point) => {
                if (point.value === null) {
                  return null;
                }
                return <circle key={`${country.iso2}-${point.year}`} cx={x(point.year)} cy={y(point.value)} r="2.7" fill={palette[idx % palette.length]} />;
              })}
            </g>
          );
        })}
      </svg>

      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3">
        {data.map((country, idx) => (
          <div key={country.iso2} className="flex items-center gap-2 text-xs text-nwi-muted">
            <span className="inline-block h-2 w-5 rounded-full" style={{backgroundColor: palette[idx % palette.length]}} />
            <span>{country.countryName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
