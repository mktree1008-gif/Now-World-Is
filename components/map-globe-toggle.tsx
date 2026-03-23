'use client';

import {cn} from '@/lib/utils/cn';

type Props = {
  view: 'map' | 'globe';
  onChange: (view: 'map' | 'globe') => void;
  labels: {map: string; globe: string};
};

export function MapGlobeToggle({view, onChange, labels}: Props) {
  return (
    <div className="inline-flex rounded-xl border border-[#2a3e60] bg-[#0b1729]/95 p-1">
      <button
        type="button"
        onClick={() => onChange('map')}
        className={cn(
          'rounded-lg px-4 py-2 text-sm transition',
          view === 'map' ? 'bg-cyan-500/25 text-cyan-50' : 'text-nwi-muted hover:text-nwi-text'
        )}
      >
        {labels.map}
      </button>
      <button
        type="button"
        onClick={() => onChange('globe')}
        className={cn(
          'rounded-lg px-4 py-2 text-sm transition',
          view === 'globe' ? 'bg-cyan-500/25 text-cyan-50' : 'text-nwi-muted hover:text-nwi-text'
        )}
      >
        {labels.globe}
      </button>
    </div>
  );
}
