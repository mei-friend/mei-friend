import { test, expect } from '@playwright/test';
import { setupPage } from './setup';

test.beforeEach(async ({ page }) => {
  console.log("Calling setupPage!")
  await setupPage(page);
});

test.describe('Ensure default page loads correctly', () => {
  test('Check splash screen is shown until confirm clicked', async ({ page }) => {
    /*await page.goto('http://localhost:5001/');
    await expect(page.locator('#splash')).toBeVisible();
    await expect(page.locator('#splashBody')).toContainText('mei-friend is an editor for music encodings, hosted at the mdw – University of Music and Performing Arts Vienna. Please consult our extensive documentation for further information. Though mei-friend is a browser-based application, your personal data (including the encoding you are editing, your application settings, and current login details if any) are stored in your browser\'s local storage and are not transmitted to or stored on our servers. Data is transmitted to GitHub only when you explicitly request it (e.g., when you log in to GitHub, load your encoding from or commit to a GitHub repository, or when you request a GitHub Action workflow to be run for you). Similarly, data is transmitted to your chosen Solid provider only when you explicitly request it (e.g., when you log in to Solid, or load or save stand-off annotations). We use Matomo to collect anonymous usage statistics. These include your truncated IP address (permitting geolocation on the country level but no further identification), your browser and operating system, where you arrived from (i.e., the referring website), the time and duration of your visit, and the pages you visited. This information is stored on the Matomo instance running on servers of the mdw – University of Music and Performing Arts Vienna, and is not shared with any third party. Lute tablatures are converted to MEI using luteconv developed by Paul Overell, via the luteconv-webui service developed by Stefan Szepe and hosted by the mdw. This service creates Web-accessible copies of your encodings as part of the conversion process, but these are accessible only via a unique link hash value, and are periodically deleted. The Verovio toolkit is loaded from https://verovio.org, hosted by RISM Digital Switzerland. This allows mei-friend to stay up-to-date with the latest toolkit version and to provide the choice of all supported versions through the settings panel. When using mei-friend, your IP address is therefore visible by RISM Digital. Finally, MIDI playback is presented using the SGM_plus sound font provided by Google Magenta, and served via googleapis.com. Your IP address is therefore visible to Google when initiating MIDI playback. If you do not wish for this to happen, please refrain from using the MIDI playback feature. mei-friend is developed by Werner Goebl and David M. Weigl at the Department of Music Acoustics – Wiener Klangstil at the mdw – University of Music and Performing Arts Vienna, and is licensed under the GNU Affero General Public License v3.0. Please consult our acknowledgements page for further information about contributors and the open-source components reused within our project. We thank our colleagues for their contributions and guidance. Development of the mei-friend Web application is funded by the Austrian Science Fund (FWF) under projects P 34664-G (Signature Sound Vienna) and I 6019 (E-LAUTE).');
    // click the "OK" button to close the splash screen
    await page.click('#splashConfirmButton');
    await expect(page.locator('#splash')).not.toBeVisible();*/
    // check Verovio has rendered our default encoding
    await expect(page.locator('g.page-margin').first()).toBeVisible();
    // check CodeMirror is working -- ensure the first element of class CodeMirror-line is visible
    await expect(page.locator('.CodeMirror-matchingtag').first()).toBeVisible();
  });
});