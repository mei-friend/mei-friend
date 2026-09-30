import { test, expect, Page } from '@playwright/test';
import { setupPage } from './setup';

// ─── Hand-off parameters ──────────────────────────────────────────────────────

// An explicit le_base keeps the return address independent of the referrer and
// of a local env.js; nothing is ever served from it except what we route here.
const LE_BASE = 'https://lets-encode.test/campaigns';
const CAMPAIGN = 'probe';
const TASK = '7';
// Never fetched: in Let's Encode mode the file is opened through the GitHub
// integration, which needs a login these tests stop short of.
const FILE = 'https://raw.githubusercontent.com/testuser/test-repo/encode-7/probe.mei';

function handOffUrl(params: Record<string, string>) {
  return '/?' + new URLSearchParams(params).toString();
}

const fullHandOff = handOffUrl({ le_campaignname: CAMPAIGN, le_taskid: TASK, file: FILE, le_base: LE_BASE });

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Loads a complete hand-off and dismisses the splash screen. Not being logged
 * in, mei-friend then sends the volunteer to GitHub; answering /login with
 * 204 No Content keeps the browser on the page, and the rest of the initial
 * load (keymap, URL clean-up) runs as it would before a real redirect.
 */
async function setupLetsEncodePage(page: Page) {
  await page.route(
    (url) => url.pathname === '/login',
    (route) => route.fulfill({ status: 204 })
  );
  await page.goto(fullHandOff);
  await page.locator('#splashConfirmButton').waitFor({ state: 'visible' });
  await page.locator('#splashConfirmButton').click();
  // setKeyMap() tags the body; the shortcuts are live from here on
  await page.waitForFunction(() => document.body.classList.contains('all'));
}

/**
 * Presses a shortcut with nothing focused, and reports whether the keystroke was
 * kept from the browser (which would otherwise open its own save, print or
 * open-file dialog). The app stops the event's propagation, so it is caught on
 * the way down, in the capture phase.
 * `Mod` stands for Cmd or Ctrl as the app sees the platform, which follows the
 * browser's user agent (Windows, for Playwright's Desktop Chrome), not the host
 * — so not Playwright's ControlOrMeta, which follows the host.
 */
async function pressShortcut(page: Page, keys: string): Promise<boolean> {
  const mod = await page.evaluate(() => {
    (document.activeElement as HTMLElement | null)?.blur();
    delete (window as any).__lastKeydown;
    if (!(window as any).__watchingKeydown) {
      (window as any).__watchingKeydown = true;
      window.addEventListener(
        'keydown',
        (ev) => {
          // the modifiers arrive as keydowns of their own
          if (!['Control', 'Meta', 'Shift', 'Alt'].includes(ev.key)) (window as any).__lastKeydown = ev;
        },
        { capture: true }
      );
    }
    // as defaults.js derives it
    const platform = ((navigator as any).userAgentData?.platform || navigator.platform || '').toLowerCase();
    return platform.startsWith('mac') ? 'Meta' : 'Control';
  });
  await page.keyboard.press(keys.replace('Mod', mod));
  return page.evaluate(() => (window as any).__lastKeydown?.defaultPrevented === true);
}

/** Records downloads and file choosers from now on. */
function watchFileActions(page: Page) {
  const seen: string[] = [];
  page.on('download', (d) => seen.push('download ' + d.suggestedFilename()));
  page.on('filechooser', () => seen.push('filechooser'));
  return seen;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

test.describe('1 Hand-off, before login', () => {
  test('1.1 Splash introduces Let\'s Encode; File menu hidden, Code menu kept', async ({ page }) => {
    await page.goto(fullHandOff);
    await page.locator('#splashConfirmButton').waitFor({ state: 'visible' });
    await expect(page.locator('#splashLetsEncode')).toBeVisible();
    await expect(page.locator('#splashLetsEncode')).not.toBeEmpty();
    // already hidden behind the splash, not only after it
    await expect(page.locator('#fileMenuTitle')).toBeHidden();
    await expect(page.locator('#editMenuTitle')).toBeVisible();
  });

  test('1.2 Logo opens the task page in a new tab, without an outcome', async ({ page }) => {
    await page.goto(fullHandOff);
    const logo = page.locator('#meiFriendLogoLink');
    await expect(logo).toHaveAttribute('target', '_blank');
    const href = new URL((await logo.getAttribute('href')) as string);
    expect(href.origin + href.pathname).toBe(LE_BASE + '/' + CAMPAIGN);
    expect(href.searchParams.get('task')).toBe(TASK);
    expect(href.searchParams.has('mf_status')).toBe(false);
  });

  test('1.3 Task parameters stay in the URL after the initial load', async ({ page }) => {
    await setupLetsEncodePage(page);
    // completeInitialLoad() strips the query string, sparing the task's
    await expect
      .poll(() => new URL(page.url()).searchParams.get('le_taskid'))
      .toBe(TASK);
    const params = new URL(page.url()).searchParams;
    expect(params.get('le_campaignname')).toBe(CAMPAIGN);
    expect(params.get('file')).toBe(FILE);
    expect(params.get('le_base')).toBe(LE_BASE);
  });

  for (const [n, missing] of [
    ['1.4', 'le_taskid'],
    ['1.5', 'file'],
  ]) {
    test(`${n} Missing ${missing} returns to the campaign as failed`, async ({ page }) => {
      await page.route(LE_BASE + '/**', (route) => route.fulfill({ contentType: 'text/html', body: 'campaign' }));
      const params: Record<string, string> = { le_campaignname: CAMPAIGN, le_taskid: TASK, file: FILE, le_base: LE_BASE };
      delete params[missing];
      // no splash to dismiss: the failure is reported before it would show
      await page.goto(handOffUrl(params));
      await page.waitForURL(LE_BASE + '/**');
      const returned = new URL(page.url());
      expect(returned.origin + returned.pathname).toBe(LE_BASE + '/' + CAMPAIGN);
      expect(returned.searchParams.get('mf_status')).toBe('failed');
      expect(returned.searchParams.get('mf_msg')).toContain(missing);
    });
  }

  test('1.6 Missing le_campaignname shows an alert, having nowhere to report to', async ({ page }) => {
    await page.goto(handOffUrl({ le_taskid: TASK, le_base: LE_BASE }));
    await page.locator('#splashConfirmButton').waitFor({ state: 'visible' });
    await page.locator('#splashConfirmButton').click();
    await expect(page.locator('#alertOverlay')).toBeVisible();
    await expect(page.locator('#alertMessage')).toContainText("Let's Encode");
    expect(page.url()).not.toContain(LE_BASE);
    // not a task: ordinary mei-friend, File menu and all
    await expect(page.locator('#fileMenuTitle')).toBeVisible();
  });
});

test.describe('2 File menu shortcuts', () => {
  test('2.1 Outside Let\'s Encode, Save and Open act (the detectors below work)', async ({ page }) => {
    await setupPage(page);
    const seen = watchFileActions(page);
    await pressShortcut(page, 'Mod+s');
    await expect.poll(() => seen).toContainEqual(expect.stringMatching(/^download .*\.mei$/));
    await pressShortcut(page, 'Mod+o');
    await expect.poll(() => seen).toContain('filechooser');
  });

  test('2.2 In Let\'s Encode, File menu shortcuts are swallowed', async ({ page }) => {
    await setupLetsEncodePage(page);
    const seen = watchFileActions(page);
    // Save included: without the task menu (i.e. before login) there is nothing to save to
    for (const keys of [
      'Mod+o',
      'Mod+s',
      'Mod+Shift+b',
      'Mod+Shift+s',
      'Mod+p',
      'Mod+l',
    ]) {
      expect(await pressShortcut(page, keys), keys + ' reached the browser').toBe(true);
    }
    // downloadMeiBasic and downloadSpeedMei go through a worker: allow them time
    await page.waitForTimeout(2000);
    expect(seen).toEqual([]);
    await expect(page.locator('#vrv-mmOutput')).not.toBeChecked(); // no PDF mode
    await expect(page.locator('#alertOverlay')).toBeHidden(); // no generated URL
  });

  test('2.3 In Let\'s Encode, other shortcuts still act', async ({ page }) => {
    await setupLetsEncodePage(page);
    await pressShortcut(page, 'Mod+,');
    await expect(page.locator('#settingsPanel')).toHaveClass(/\bin\b/);
  });

  test('2.4 In Let\'s Encode, Save commits the task, once at a time', async ({ page }) => {
    await setupLetsEncodePage(page);
    const seen = watchFileActions(page);
    // Stand in for the GitHub commit: the task menu is given it at login,
    // and the Save shortcut reuses it.
    await page.evaluate(async () => {
      const le = await import('/static/lib/lets-encode.js');
      (window as any).__commits = [];
      le.renderLetsEncodeMenu({ fileChanged: async () => false }, async (msg: string) => {
        (window as any).__commits.push(msg);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { ok: true };
      });
    });
    const commits = () => page.evaluate(() => (window as any).__commits as string[]);

    expect(await pressShortcut(page, 'Mod+s')).toBe(true);
    await expect(page.locator('#letsEncodeOverlay')).toHaveClass(/\bactive\b/);
    // a second press while the save is under way must not queue another
    await pressShortcut(page, 'Mod+s');
    await expect(page.locator('#letsEncodeOverlay')).not.toHaveClass(/\bactive\b/);
    // the message the campaign reads, ending in the version string
    expect(await commits()).toEqual([
      expect.stringMatching(new RegExp(`^Let's Encode: ${CAMPAIGN} task ${TASK} saved using mei-friend \\S+$`)),
    ]);
    await expect(page.locator('#letsEncodeLastSaveIndicator')).toContainText('Last save:');

    // and once it is done, Save works again
    await pressShortcut(page, 'Mod+s');
    await expect.poll(async () => (await commits()).length).toBe(2);
    expect(seen).toEqual([]); // never a download
  });
});
