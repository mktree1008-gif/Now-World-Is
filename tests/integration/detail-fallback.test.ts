import {describe, expect, test} from 'vitest';
import {getCountryDetailByIso2} from '@/lib/country-service';

describe('country detail fallback', () => {
  test('returns safe demographics note when unsupported', async () => {
    const detail = await getCountryDetailByIso2('KR', 'en');
    expect(detail.notes).toBeTruthy();
    expect(detail.notes?.toLowerCase()).toContain('demographic');
  });
});
