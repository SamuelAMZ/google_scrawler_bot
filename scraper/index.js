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

// fonctions imports
const paginateAndReturnResults = require("./paginateInPages/index");

// db funtions
const addNewResult = require("../db/addNewResult");

// connect to db
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_URI, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to db");
  }
});

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

  const keyword = "kimberlina cherie";

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
  const results = await paginateAndReturnResults(page);
  if (!results) {
    console.log("no result found");
    // add only the keyword nothing else
    await addNewResult({ keyword });
  } else {
    console.log(results, results.length);
    // add all results to db
    await addNewResult({ keyword, allResults: results });
  }

  //   wait
  await page.waitForTimeout(3000);

  //   close browser
  await browser.close();
};

scrapper();
