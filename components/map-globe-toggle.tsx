'use client';

import {cn} from '@/lib/utils/cn';

type Props = {
  view: 'map' | 'globe';
  onChange: (view: 'map' | 'globe') => void;
  labels: {map: string; globe: string};
};

export function MapGlobeToggle({view, onChange, labels}: Props) {
  return (
    <div className="inline-flex rounded-lg border border-nwi-border bg-[#07101b] p-1">
      <button
        type="button"
        onClick={() => onChange('map')}
        className={cn(
          'rounded-md px-3 py-1.5 text-xs transition',
          view === 'map' ? 'bg-sky-500/25 text-sky-100' : 'text-nwi-muted hover:text-nwi-text'
        )}
      >
        {labels.map}
      </button>
      <button
        type="button"
        onClick={() => onChange('globe')}
        className={cn(
          'rounded-md px-3 py-1.5 text-xs transition',
          view === 'globe' ? 'bg-sky-500/25 text-sky-100' : 'text-nwi-muted hover:text-nwi-text'
        )}
      >
        {labels.globe}
      </button>
    </div>
  );
}
