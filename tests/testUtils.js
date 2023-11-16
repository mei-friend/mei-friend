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
  selectFromDropdown: async function (driver, dropdownId, option) {
    console.log("Called with : ", dropdownId, option)
    try {
      const selectElement = driver.findElement(By.id(dropdownId));
      const optionElement = selectElement.findElement(By.css("option[value='" + option + "']"));
      optionElement.click();
      console.log("CLICKED!")
      await driver.wait(until.elementLocated(By.id('mei-friend-logo')), 10000).then(async (meiFriendLogo) => {
        console.log("FOUND!");
      }).catch((e) => {
        console.log("ERROR: ", e)
      })
    } catch (error) {
      console.error('Error selecting option from dropdown via UI: ', error);
    }
  },
};
