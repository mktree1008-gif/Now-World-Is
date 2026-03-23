import {test, expect} from '@playwright/test';

test('compare page shows metric controls', async ({page}) => {
  await page.goto('/en/compare');
  await expect(page.getByText('Country Compare Lab')).toBeVisible();
  await expect(page.getByText('Metric selection')).toBeVisible();
});
