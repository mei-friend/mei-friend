const { Builder, By, Key, until } = require('selenium-webdriver');
module.exports = {
  /* splash modals */
  clickSplashConfirmButton: function (driver) {
    try {
      driver.findElement(By.id('splashConfirmButton')).click();
      console.log('Splash confirm button clicked!');
    } catch (error) {
      console.error('Error clicking splash confirm button via UI: ', error);
    }
  },
  closeSettings: function (driver) {
    try {
      driver.findElement(By.id('hideSettingsButton')).click();
      console.log('Hide settings button clicked!');
    } catch (error) {
      console.error('Error clicking hide settings button via UI: ', error);
    }
  },
  openUrl: function (driver, url) {
    try {
      driver.findElement(By.id('fileMenuTitle')).click();
      console.log('File menu clicked!');
      driver.findElement(By.id('openUrl')).click();
      console.log('OpenURL clicked!');
      driver.findElement(By.id('openUrlInput')).sendKeys(url);
      console.log('URL entered!');
      driver.findElement(By.id('openUrlButton')).click();
      console.log('OpenURL button clicked!');
    } catch (error) {
      console.error('Error opening URL via UI: ', error);
    }
  },
  openSettingsTab: async function (driver, tab) {
    try {
      const hideSettingsButton = driver.findElement(By.id('hideSettingsButton'))
      if (await hideSettingsButton.isDisplayed()) {
        console.log('Settings menu was already open!');
      } else {
        driver.findElement(By.id('showSettingsButton')).click();
        console.log('Settings menu was closed - clicking to open!');
      }
      if (tab) {
        console.log("trying to click tab", tab)
        driver.findElement(By.id(tab)).click();
        console.log('Settings tab clicked: ', tab);
      }
    } catch (error) {
      console.error('Error opening settings tab via UI: ', error);
    }
    driver.findElement(By.id('fileMenuTitle')).click();
  },
  publicRepertoire: async function (driver, composer, encoding) {
    try {
      driver.findElement(By.id('fileMenuTitle')).click();
      console.log('File menu clicked!');
      driver.findElement(By.id('openExample')).click();
      console.log('Public repertoire clicked!');
      await this.selectFromDropdown(driver, 'sampleEncodingsComposer', composer);
      await driver.wait(until.elementLocated(By.CSS_SELECTOR, `select[value='${composer}'`, 5000));
      await this.selectFromDropdown(driver, 'sampleEncodingsEncoding', encoding);
      let sampcomp = await driver.findElement(By.id('sampleEncodingsComposer'))
      let sampcompval = await sampcomp.getAttribute('value');
      console.log("sampcompval", sampcompval)
      driver.findElement(By.id('openUrlButton')).click();
      console.log('OpenURL button clicked!');
    } catch (error) {
      console.error('Error opening URL via UI: ', error);
    }
  },
  selectFromDropdown: async function (driver, dropdownId, option, eventType = "change") {
    console.log("Attempting to select from dropdown: ", dropdownId, option)
    try {
      await driver.executeScript(`
        const selectElement = document.getElementById("${dropdownId}");
        // simulate click on the specified option
        selectElement.value = "${option}";
        // dispatch an input event on the selectElement
        selectElement.dispatchEvent(new Event('${eventType}', { bubbles: true }));
        console.log("Set ${dropdownId} to ${option} via UI");
      `);
    } catch (error) {
      console.error('Error selecting option from dropdown via UI: ', error);
    }
  },
};
