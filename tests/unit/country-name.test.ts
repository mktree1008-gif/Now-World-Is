import {describe, expect, test} from 'vitest';
import {normalizeCountryName, resolveIso2ByName, resolveIso2FromGeo} from '@/lib/utils/country';
import {mockCountrySummaries} from '@/lib/data/mock-countries';

describe('country name utilities', () => {
  test('normalizes punctuation and accents', () => {
    expect(normalizeCountryName('Côte d\'Ivoire')).toBe('cote d ivoire');
  });

  test('resolves alias names', () => {
    expect(resolveIso2ByName('United States of America', mockCountrySummaries)).toBe('US');
    expect(resolveIso2ByName('Republic of Korea', mockCountrySummaries)).toBe('KR');
  });

  test('prefers geo id/code mapping when available', () => {
    expect(resolveIso2FromGeo({id: 'USA', properties: {name: 'Foo'}}, mockCountrySummaries)).toBe('US');
    expect(resolveIso2FromGeo({id: '-99', properties: {iso_a3: 'KOR'}}, mockCountrySummaries)).toBe('KR');
  });
});
