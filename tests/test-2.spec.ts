import { test, expect } from '@playwright/test';

test('wrong data format', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.reload();
  expect(page.getByText('[object Object]')).toBeVisible();
  await page.getByRole('button', { name: 'Lade eine Datei hoch' }).click();
  const inputUploadHandle = await page.$('input[type=file]');
  await inputUploadHandle.setInputFiles('tests/test.txt');

  expect(page.getByText('Falsches Dateiformat')).toBeVisible();
  await page.getByText('[object Object]').click();
  
});
