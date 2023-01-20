const puppeteer = require("puppeteer-extra");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const { executablePath } = require("puppeteer");

// ressource blocker
const blockResourcesPlugin =
  require("puppeteer-extra-plugin-block-resources")();
puppeteer.use(blockResourcesPlugin);

require("dotenv").config();

// fonctions imports
const linkBasedNavigation = require("./linkNavigation/index");

const videosTabScraper = async (keyword, numberOfPage) => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: executablePath(),
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1840,
    height: 1080,
    deviceScaleFactor: 1,
  });

  // visit from the top of the archives
  await page.goto("https://google.com", {
    waitUntil: "networkidle2",
    timeout: 120000,
  });

  // const keyword = "kimberlina cherie";

  //   typing the keyword
  await page.waitForSelector("[name='q']");
  await page.type("[name='q']", keyword, {
    delay: 100,
  });

  //   click for search
  const launchSearchBtn = await page.$("[name='btnK']");
  await launchSearchBtn.evaluate((b) => b.click());

  //   wait
  await page.waitForTimeout(3000);

  //   paginate on the first 10 results and return all results
  const results = await linkBasedNavigation(page, numberOfPage, keyword);

  if (!results) {
    console.log("no result found");

    //   close browser
    await browser.close();

    // return to notify req
    return false;
  } else {
    console.log(results, results.length);

    //   close browser
    await browser.close();

    // return to notify req
    return results;
  }
};

module.exports = videosTabScraper;
