import { test, expect } from '@playwright/test';
import { setupPage } from './setup';

const clara: string = '/?file=https://raw.githubusercontent.com/trompamusic-encodings/Schumann-Clara_Romanze-in-a-Moll/b408031f725b0a1f4eea57a89a04c75c3431da62/Schumann-Clara_Romanze-ohne-Opuszahl_a-Moll.mei';

test('Test url param: file', async ({ page }) => {
    await setupPage(page, clara);
    await expect(page.locator('tspan#rend-0000002081006402 > tspan > tspan')).toHaveText('ROMANZE');
});

test('Test url param: page', async ({ page }) => {
    let param = '&page=';
    let paramValue = '3';
    await setupPage(page, clara + param + paramValue);
    await expect(page.locator('div#pagination2')).toHaveText(paramValue);
});

test('Test url param: breaks', async ({ page }) => {
    let param = '&breaks=';
    let paramValue = 'line';
    await setupPage(page, clara + param + paramValue);
    await expect(page.locator('select#breaksSelect')).toHaveValue(paramValue);
});

test('Test url param: speed', async ({ page }) => {
    let param = '&speed=';
    let paramValue = 'false';
    await setupPage(page, clara + param + paramValue);
    await expect(page.locator('input#speedCheckbox')).not.toBeChecked();
});

