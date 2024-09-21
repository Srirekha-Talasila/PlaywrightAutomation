import { test, expect } from '@playwright/test';
import { getTestData } from '../utilities/testDataUtils';
import { log } from 'console';


test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {


  const data = await getTestData(
    'TestSheet',
    '2_Test_1'
  );

  console.log(data.StringType)    ;
  

  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
