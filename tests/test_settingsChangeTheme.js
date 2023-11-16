const utils = require('./testUtils.js');
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function test_settingsChangeTheme() {
  let driver = await new Builder()
    .forBrowser('chrome')
    //       .setChromeOptions(new chrome.Options().headless())
    .build();
  try {
    await driver.get('https://mei-friend.mdw.ac.at');
    utils.clickSplashConfirmButton(driver);
    await utils.openSettingsTab(driver, 'editorOptionsTab');
   try {
      console.log('Settings theme test');
      await utils.selectFromDropdown(driver, 'theme', 'yeti');
      const meiFriendLogo = await driver.findElement(By.id('mei-friend-logo'));
      const srcAttribute = await meiFriendLogo.getAttribute('src');
      console.log("ping")
      console.log("src attribute: ", srcAttribute)
      assert(!srcAttribute.endsWith('logo-asleep.svg'), 'Settings theme test - unexpected outcome: owl awake during the day!');
      await utils.selectFromDropdown(driver, 'theme', 'cobalt');
      assert(srcAttribute.endsWith('logo.svg'), 'Settings theme test - unexpected outcome: owl asleep at night!');
      utils.closeSettings(driver);
    } catch (error) {
      console.error('Settings theme test - error: ', error);
    }
  } finally {
    await driver.quit();
    console.log('Settings theme test - done!');
  }
})();
