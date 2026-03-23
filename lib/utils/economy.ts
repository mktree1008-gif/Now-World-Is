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
