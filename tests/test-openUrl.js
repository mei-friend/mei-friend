
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function example() {
    let driver = await new Builder()
        .forBrowser('chrome')
 //       .setChromeOptions(new chrome.Options().headless())
        .build();
    try {
        await driver.get('https://mei-friend.mdw.ac.at');
        await driver.findElement(By.id('splashConfirmButton')).click();
        console.log("Splash confirm button clicked!");
        await driver.findElement(By.id('fileMenuTitle')).click();
        console.log("File menu clicked!");
        await driver.findElement(By.id('openUrl')).click();
        console.log("OpenURL clicked!");
        await driver.findElement(By.id('openUrlInput')).sendKeys('https://raw.githubusercontent.com/trompamusic-encodings/Beethoven_WoO57_BreitkopfHaertel/master/Beethoven_WoO57-Breitkopf.mei');
        console.log("URL entered!");
        await driver.findElement(By.id('openUrlButton')).click();
        console.log("OpenURL button clicked!");
        try {
            const measure = await driver.wait(until.elementLocated(By.id('measure-0000000970616045')), 20000);
            console.log("Sample measure found!");
            // interact with the measure element here
        } catch (error) {
            console.error("Sample measure not found - OpenURL and/or Verovio are not behaving as expected");
            console.log("Notation: ", driver.findElement(By.id('notation')).getText());
        }
    } finally {
        await driver.quit();
    }
})();
