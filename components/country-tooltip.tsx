'use client';

import {useEffect, useState} from 'react';
import {offset, shift, useFloating} from '@floating-ui/react';
import type {VirtualElement} from '@floating-ui/react';
import Image from 'next/image';
import type {CountrySummary} from '@/lib/types';
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

  return (
    <div
      ref={refs.setFloating}
      className="pointer-events-none fixed z-50 w-64 rounded-xl border border-nwi-border bg-[#091321]/95 p-3 text-xs shadow-glow"
      style={floatingStyles}
      role="status"
      aria-live="polite"
    >
      <div className="mb-2 flex items-center gap-2">
        <Image
          src={summary.flagUrl}
          alt={`${summary.englishName} flag`}
          width={24}
          height={16}
          className="h-4 w-6 rounded-sm object-cover"
        />
        <p className="font-medium text-nwi-text">{summary.localizedName}</p>
      </div>
      <p className="metric-digit text-nwi-muted">
        {labels.gdp}: {formatCurrencyValue(summary.gdpPerCapita, locale)}
      </p>
      <p className="metric-digit text-nwi-muted">
        {labels.ppp}:{' '}
        {summary.pppGdpPerCapita === null
          ? 'Latest data unavailable'
          : `${formatCurrencyValue(summary.pppGdpPerCapita, locale)} intl$`}
      </p>
      <p className="mt-1 text-[11px] text-nwi-muted/80">
        {labels.year}: {summary.gdpPerCapitaYear ?? summary.pppGdpPerCapitaYear ?? 'N/A'}
      </p>
      <p className="text-[11px] text-nwi-muted/80">
        {labels.avgIq}: {summary.averageIq ?? 'N/A'}
      </p>
    </div>
  );
}
