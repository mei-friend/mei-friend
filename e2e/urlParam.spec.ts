import { test, expect } from '@playwright/test';
import { setupPage } from './setup';

test('Test url param: file', async ({ page }) => {
    let fileUrl = "/?file=https://raw.githubusercontent.com/trompamusic-encodings/Schumann-Clara_Romanze-in-a-Moll/b408031f725b0a1f4eea57a89a04c75c3431da62/Schumann-Clara_Romanze-ohne-Opuszahl_a-Moll.mei"
    await setupPage(page, fileUrl); 
    // check if title is rendered
    await expect(page.locator('tspan#rend-0000002081006402 > tspan > tspan')).toHaveText('ROMANZE');
});


