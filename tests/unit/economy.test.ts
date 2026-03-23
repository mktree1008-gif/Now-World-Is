import {describe, expect, test} from 'vitest';
import {selectLatestValue} from '@/lib/utils/economy';

describe('selectLatestValue', () => {
  test('picks latest non-null value', () => {
    const result = selectLatestValue([
      {year: 2022, value: null},
      {year: 2021, value: 120},
      {year: 2024, value: null},
      {year: 2023, value: 180}
    ]);

    expect(result).toEqual({year: 2023, value: 180});
  });

  test('returns null when all values are null', () => {
    const result = selectLatestValue([
      {year: 2024, value: null},
      {year: 2023, value: null}
    ]);

    expect(result).toBeNull();
  });
});
