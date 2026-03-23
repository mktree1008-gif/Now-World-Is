export function formatNumber(value: number | null | undefined, locale: string): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return 'Latest data unavailable';
  }

  return new Intl.NumberFormat(locale).format(value);
}

export function formatCurrencyValue(value: number | null | undefined, locale: string, prefix = '$'): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return 'Latest data unavailable';
  }

  return `${prefix}${new Intl.NumberFormat(locale, {maximumFractionDigits: 0}).format(value)}`;
}

export function formatCompactNumber(value: number | null | undefined, locale: string): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return 'N/A';
  }

  return new Intl.NumberFormat(locale, {notation: 'compact', maximumFractionDigits: 1}).format(value);
}
