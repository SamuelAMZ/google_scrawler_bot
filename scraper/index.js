const puppeteer = require("puppeteer-extra");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

// ressource blocker
const blockResourcesPlugin =
  require("puppeteer-extra-plugin-block-resources")();
puppeteer.use(blockResourcesPlugin);

// node built in waiter
const { setTimeout } = require("timers/promises");

require("dotenv").config();

const scrapper = async () => {
  const browser = await puppeteer.launch({
    headless: false,
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

  //   typing the keyword
  await page.waitForSelector("[name='q']");
  await page.type("[name='q']", "lorem ipsum", {
    delay: 100,
  });

  //   click for search
  const launchSearchBtn = await page.$("[name='btnK']");
  await launchSearchBtn.evaluate((b) => b.click());

  //   wait
  await page.waitForTimeout(100000);

  //   close browser
  await browser.close();
};

scrapper();
