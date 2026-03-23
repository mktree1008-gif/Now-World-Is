export type IndicatorPoint = {
  year: number;
  value: number | null;
};

export function selectLatestValue(points: IndicatorPoint[]) {
  const sorted = [...points].sort((a, b) => b.year - a.year);
  return sorted.find((point) => point.value !== null) ?? null;
}

export function mergeYears(series: Record<string, IndicatorPoint[]>) {
  const yearSet = new Set<number>();

  Object.values(series).forEach((points) => {
    points.forEach((point) => yearSet.add(point.year));
  });

  return [...yearSet].sort((a, b) => a - b);
}

export function calculateAnnualGrowth(points: IndicatorPoint[]) {
  const ordered = [...points]
    .filter((point) => point.value !== null)
    .sort((a, b) => b.year - a.year);

  if (ordered.length < 2) {
    return null;
  }

  const latest = ordered[0];
  const previous = ordered[1];

  if (latest.value === null || previous.value === null || previous.value === 0) {
    return null;
  }

  const value = ((latest.value - previous.value) / previous.value) * 100;
  return {
    value,
    fromYear: previous.year,
    toYear: latest.year
  };
}
