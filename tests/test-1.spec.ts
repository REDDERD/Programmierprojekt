import { test, expect } from '@playwright/test';
import exp from 'constants';

test('sucessfull upload', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.reload();
  expect(page.getByRole('button', { name: 'Lade eine Datei hoch' })).toBeVisible();
  expect(page.getByText('[object Object]')).toBeVisible();
  await page.getByRole('button', { name: 'Lade eine Datei hoch' }).click();
  const inputUploadHandle = await page.$('input[type=file]');
  await inputUploadHandle.setInputFiles('tests/moon.csv');
  expect(page.getByRole('button', { name: 'Experteneinstellungen' })).toBeVisible();
  expect(page.getByText('insert_drive_filemoon.csv')).toBeVisible();
  await page.getByRole('button', { name: 'Experteneinstellungen' }).click();
  await page.getByLabel('execute locally').click();
  await page.getByRole('button', { name: 'K-Means durchführen' }).click();
  await page.getByText('Tabelle').click();
  expect(page.getByRole('cell', { name: 'Centroid 1' })).toBeVisible();
  await page.getByRole('cell', { name: 'Centroid 1' }).getByRole('button').click();
  await page.getByText('Diagramm').click();
  
  expect(page.getByText('[object Object]')).toBeVisible();
  await page.getByText('[object Object]').click();
 
});


