const { Builder, By, Key, until } = require('selenium-webdriver');
module.exports = {
    clickSplashConfirmButton: function (driver) {
        driver.findElement(By.id('splashConfirmButton')).click();
        console.log("Splash confirm button clicked!");
    },
    openUrl: function (driver, url) {
        try { 
            driver.findElement(By.id('fileMenuTitle')).click();
            console.log("File menu clicked!");
            driver.findElement(By.id('openUrl')).click();
            console.log("OpenURL clicked!");
            driver.findElement(By.id('openUrlInput')).sendKeys(url);
            console.log("URL entered!");
            driver.findElement(By.id('openUrlButton')).click();
            console.log("OpenURL button clicked!");
        } catch (error) {
            console.error("Error opening URL via UI: ", error);
        }
    },
  };
