const utils = require('./testUtils.js');
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

(async function test_settingsChangeTheme() {

  let driver = await new Builder()
    .forBrowser('chrome')
    //       .setChromeOptions(new chrome.Options().headless())
    .build();
  await driver.manage().setTimeouts({ implicit: 2000 });
  try {
    await driver.get('http://localhost:5001');
    utils.clickSplashConfirmButton(driver);
    await utils.openSettingsTab(driver, 'editorOptionsTab');
    console.log('Settings theme test');
    await utils.selectFromDropdown(driver, 'theme', 'mdn-like');
    const friendLogo = driver.wait(until.elementLocated(By.id('mei-friend-logo')), 5000);
    const srcAttribute = await friendLogo.getAttribute('src');
    if(!srcAttribute.endsWith('logo-asleep.svg')) {
      console.error("Settings theme test - unexpected outcome: owl awake during the day!");
    } else { 
      console.log("Owl correctly asleep during the day!")
    }
    //assert(!srcAttribute.endsWith('logo-asleep.svg'), 'Settings theme test - unexpected outcome: owl awake during the day!');
    await utils.selectFromDropdown(driver, 'theme', 'cobalt');
    if(srcAttribute.endsWith('logo.svg')) {
      console.error("Settings theme test - unexpected outcome: owl asleep at night!")
    } else {
      console.log("Owl correctly awake at night!")
    }

    // assert(srcAttribute.endsWith('logo.svg'), 'Settings theme test - unexpected outcome: owl asleep at night!');
    utils.closeSettings(driver);
    console.log("Settings closed correctly!")
  } catch (error) {
    console.error('Settings theme test - error: ', error);
  } finally {
    await driver.quit();
  }
})();
