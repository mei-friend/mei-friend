const utils = require('./testUtils.js');
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

(async function test_openUrlWorkflow() {
  let driver = await new Builder()
    .forBrowser('chrome')
    //       .setChromeOptions(new chrome.Options().headless())
    .build();
  await driver.manage().setTimeouts({ implicit: 2000 });
  try {
    await driver.get('http://localhost:5001');
    utils.clickSplashConfirmButton(driver);
    utils.openUrl(
      driver,
      'https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO57_BreitkopfHaertel/master/Beethoven_WoO57-Breitkopf.mei'
    );

    const measure = await driver.wait(until.elementLocated(By.id('measure-0000000970616045')), 5000);
    assert(measure, 'Sample measure not found - OpenURL and/or Verovio are not behaving as expected');
    console.log('Sample measure found!');
  } catch (error) {
    console.error('OpenURL workflow test - error: ', error);
  } finally {
    await driver.quit();
  }
})();
