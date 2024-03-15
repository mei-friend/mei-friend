import { Page } from "@playwright/test";

export const defaultUrl = '/';

export async function setupPage(page: Page, url = defaultUrl) {
  await page.goto(url);
  await page.click('#splashConfirmButton');
}

export async function openUrl(page: Page, url: string) {
  await page.click('#fileMenuTitle');
  // click on the element with ID "openUrl"
  await page.click('#openUrl');
  // focus on the element with ID "openUrlInput"
  await page.focus('#openUrlInput');
  // input known URL into the focused element
  await page.keyboard.type(url);
  await page.click('#openUrlButton');
}
