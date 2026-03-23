'use client';

import {useEffect, useState} from 'react';
import {offset, shift, useFloating} from '@floating-ui/react';
import type {VirtualElement} from '@floating-ui/react';
import {TrendingUp} from 'lucide-react';
import Image from 'next/image';
import type {CountrySummary} from '@/lib/types';
import {useCountryGrowth} from '@/lib/hooks/use-country-growth';
import {formatCurrencyValue} from '@/lib/utils/format';

type Props = {
  summary: CountrySummary;
  locale: string;
  x: number;
  y: number;
  labels: {
    gdp: string;
    ppp: string;
    year: string;
    avgIq: string;
  };
};

export function CountryTooltip({summary, locale, x, y, labels}: Props) {
  const [mounted, setMounted] = useState(false);
  const {data: growthData} = useCountryGrowth(summary.iso2, locale);
  const {refs, floatingStyles, update} = useFloating({
    placement: 'right-start',
    strategy: 'fixed',
    middleware: [offset(12), shift({padding: 8})]
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const virtualReference: VirtualElement = {
      getBoundingClientRect: () => new DOMRect(x, y, 0, 0)
    };

    refs.setReference(virtualReference);

    update?.();
  }, [mounted, refs, update, x, y]);

  const growth = growthData?.gdpGrowth ?? growthData?.pppGrowth ?? null;
  const growthLabel =
    growth && Number.isFinite(growth.value)
      ? `${growth.value >= 0 ? '+' : ''}${growth.value.toFixed(1)}% annual growth`
      : 'Annual growth unavailable';

  return (
    <div
      ref={refs.setFloating}
      className="pointer-events-none fixed z-50 w-[18.5rem] rounded-2xl border border-[#2f415d] bg-[#15233a]/92 p-4 text-xs shadow-[0_30px_80px_rgba(2,7,18,0.65)] backdrop-blur-lg"
      style={floatingStyles}
      role="status"
      aria-live="polite"
    >
      <div className="mb-4 flex items-center gap-3">
        <Image
          src={summary.flagUrl}
          alt={`${summary.englishName} flag`}
          width={32}
          height={22}
          className="h-6 w-9 rounded-sm object-cover ring-1 ring-white/15"
        />
        <div>
          <p className="text-sm font-semibold tracking-tight text-nwi-text">{summary.localizedName}</p>
          <p className="text-[10px] uppercase tracking-[0.16em] text-cyan-300/80">{summary.englishName}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-end justify-between border-b border-white/10 pb-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#96a9c6]">{labels.gdp}</span>
          <span className="metric-digit text-2xl font-semibold tracking-tight text-white">
            {formatCurrencyValue(summary.gdpPerCapita, locale)}
          </span>
        </div>
        <div className="flex items-end justify-between border-b border-white/10 pb-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#96a9c6]">{labels.ppp}</span>
          <span className="metric-digit text-xl font-semibold tracking-tight text-[#d3e0f2]">
            {summary.pppGdpPerCapita === null
              ? 'N/A'
              : `${formatCurrencyValue(summary.pppGdpPerCapita, locale)} intl$`}
          </span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
        <p className="rounded-lg bg-[#0f1a2d]/80 px-2 py-1.5 text-[#9eb0ca]">
          {labels.year}: <span className="metric-digit text-white">{summary.gdpPerCapitaYear ?? summary.pppGdpPerCapitaYear ?? 'N/A'}</span>
        </p>
        <p className="rounded-lg bg-[#0f1a2d]/80 px-2 py-1.5 text-[#9eb0ca]">
          {labels.avgIq}: <span className="metric-digit text-white">{summary.averageIq ?? 'N/A'}</span>
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3 text-[11px] font-semibold uppercase tracking-[0.11em] text-[#f7bf77]">
        <TrendingUp className="h-3.5 w-3.5" />
        <span>{growthLabel}</span>
      </div>
    </div>
  );
}
