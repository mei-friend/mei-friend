import { test, expect, Page } from '@playwright/test';
import { defaultUrl } from './setup';

// The owl logos are SVGs, which WebKit (Safari) does not render correctly, so the
// pixel versions are shown there. index.html settles that before the body is
// parsed, so that no logo is ever shown -- or even fetched -- in the wrong format,
// neither in the header nor on the splash screen (which appears before the app has
// finished loading, and used to show the SVG until the encoding was rendered).

test('the logo format is settled before the splash screen appears', async ({ page, browserName }) => {
  const expected = 'menu-logo' + (browserName === 'webkit' ? '.png' : '.svg');
  const requested: string[] = [];
  page.on('request', (r) => {
    const logo = r.url().match(/owl\/([^/?]*menu-logo[^/?]*)/);
    if (logo) requested.push(logo[1]);
  });

  await page.goto(defaultUrl);
  await page.locator('#splashConfirmButton').waitFor({ state: 'visible' });

  const src = (id: string) => page.locator('#' + id).getAttribute('src');
  expect(await src('splashLogo'), 'splash logo when the splash appears').toContain(expected);
  expect(await src('mei-friend-logo'), 'header logo when the splash appears').toContain(expected);
  // nothing in the other format was fetched on the way
  expect([...new Set(requested)], 'logo files requested').toEqual([expected]);
  // and the one that was fetched really is an image in this browser
  await expect
    .poll(() => page.locator('#splashLogo').evaluate((img: HTMLImageElement) => img.naturalWidth), { timeout: 10000 })
    .toBeGreaterThan(0);
});

// The Let's Encode graphics are SVGs as well: the joint logo Eulise wears in that
// mode, and the hand of the interstitial overlay (with a night variant for some
// gestures). They follow the same rule as the logos.
const LE_BASE = 'https://lets-encode.test/campaigns';
const handOff =
  '/?' +
  new URLSearchParams({
    le_campaignname: 'probe',
    le_taskid: '7',
    file: 'https://raw.githubusercontent.com/testuser/test-repo/encode-7/probe.mei',
    le_base: LE_BASE,
  }).toString();

/** Shows the Let's Encode overlay in a state and returns its hand picture. */
async function handFor(page: Page, state: string) {
  return page.evaluate(async (state) => {
    const letsEncode = await import('/static/lib/lets-encode.js');
    letsEncode.showLetsEncodeOverlay({ message: 'test', state });
    const img = document.getElementById('letsEncodeHandPic') as HTMLImageElement;
    await img.decode().catch(() => {});
    return { src: img.getAttribute('src') || '', width: img.naturalWidth };
  }, state);
} // handFor()

test("the Let's Encode graphics come in the same format as the logos", async ({ page, browserName }) => {
  const ext = browserName === 'webkit' ? '.png' : '.svg';
  const requested: string[] = [];
  page.on('request', (r) => {
    const graphic = r.url().match(/owl\/(?:hands\/)?[^/?]+\.(?:svg|png)/);
    if (graphic) requested.push(graphic[0]);
  });
  // the hand-off visits /login, which these tests stop short of
  await page.route(
    (url) => url.pathname === '/login',
    (route) => route.fulfill({ status: 204 })
  );

  await page.goto(handOff);
  await page.locator('#splashConfirmButton').waitFor({ state: 'visible' });
  await page.locator('#splashConfirmButton').click();
  // in Let's Encode mode the navbar carries the joint logo
  await expect(page.locator('#mei-friend-logo')).toHaveAttribute('src', new RegExp('mei-friend-lets-encode\\' + ext));

  // one hand per state of the interstitial, each of them a picture that loads
  for (const [state, file] of [
    ['busy', 'pinch-orange'],
    ['done', 'wave-pink'],
    ['completing', 'handshake'],
    ['failed', 'measure-blue'],
  ]) {
    const hand = await handFor(page, state);
    expect(hand.src, state + ' hand').toContain('hands/' + file + ext);
    expect(hand.width, state + ' hand is loaded').toBeGreaterThan(0);
  }

  // a dark theme takes the night variants, of the logo and of the hands with one
  await page.evaluate(async () => (await import('/static/lib/lets-encode.js')).hideLetsEncodeOverlay());
  await page.click('#showSettingsButton');
  await page.click('#editorOptionsTab');
  await page.locator('#theme').selectOption('darcula');
  await expect(page.locator('#mei-friend-logo')).toHaveAttribute(
    'src',
    new RegExp('mei-friend-lets-encode-dark\\' + ext)
  );
  const night = await handFor(page, 'done');
  expect(night.src, 'night hand').toContain('hands/wave-pink-dark' + ext);
  expect(night.width, 'night hand is loaded').toBeGreaterThan(0);

  // nothing in the other format was fetched on the way
  expect(
    requested.filter((r) => !r.endsWith(ext)),
    'graphics requested in the other format'
  ).toEqual([]);
});
