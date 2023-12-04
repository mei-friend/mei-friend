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
        utils.publicRepertoire(driver, "Mozart, Wolfgang Amadeus", "https://raw.githubusercontent.com/craigsapp/mozart-piano-sonatas/master/kern/sonata02-2.krn");
        const measure = await driver.wait(until.elementLocated(By.id('measure-L1')), 5000);
        assert(measure, "Sample measure not found - publicRepertoire and/or Kern import are not working as expected");
        console.log("Sample measure found!");
    } catch(error) { 
        console.error('PublicRepertoire workflow test - error: ', error);
    } finally {
        await driver.quit();
    }
})();
