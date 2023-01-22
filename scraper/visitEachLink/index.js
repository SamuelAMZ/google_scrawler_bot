const puppeteer = require("puppeteer-extra");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

// ressource blocker
const blockResourcesPlugin =
  require("puppeteer-extra-plugin-block-resources")();
puppeteer.use(blockResourcesPlugin);

const { executablePath } = require("puppeteer");
require("dotenv").config();

// fonctions imports
const returnkeywordArray = require("./checkKeyword/returnkeywordArray");
const checkForKeywordOnPage = require("./checkKeyword/index");
const checkForVideo = require("./checkForVideo/index");

// models
const Searches = require("../../models/Searches");

// const links = [
//   "https://www.sexysluts.tv/videos/787843/kimberlina-cherie-courtney-taylor-realtwinz-compilat/",
//   "https://pornzog.com/video/14204695/realtwinz-kimberlina-cherie-courtney-taylor-video-6/",
//   "https://nudespree.com/videos/1830302/kimberlina-cherie-courtney-taylor-realtwinz-compilat/",
// ];
// const keyword = "kimberlina cherie";

const visitEachLinkScraper = async (links, keyword, docId) => {
  // search for search doc
  const search = await Searches.findOne({ _id: docId });
  if (!search) {
    return console.log("search not found in individual page loop");
  }

  // launch browser
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: executablePath(),
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--disable-infobars",
      "--window-position=0,0",
      "--ignore-certifcate-errors",
      "--ignore-certifcate-errors-spki-list",
      "--no-zygote",
      "--disable-gpu",
      // "--disable-web-security",
      // "--disable-features=IsolateOrigins,site-per-process,BlockInsecurePrivateNetworkRequests",
      // "--disable-site-isolation-trials",
    ],
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1840,
    height: 1080,
    deviceScaleFactor: 1,
  });

  // will return keyword as an array of all word combination possible
  const keywordArr = returnkeywordArray(keyword);

  //   loop to visit all links (using search.linksStats.visitedCount this because it will not go back to start if scraper stoped)
  for (let i = 0; i < links.length; i++) {
    try {
      // visit from the top of the archives
      await page.goto(links[i], {
        waitUntil: "networkidle2",
        timeout: 60000,
      });

      // update link visited count
      await search.updateOne({
        linksStats: {
          allLinksCount: links.length,
          visitedCount: i + 1,
        },
      });

      // // check for video on the target page
      const videos = await checkForVideo(page);

      //   check for the keyword on the target page
      const isKeywordPresent = await checkForKeywordOnPage(page, keywordArr);

      // add to db
      console.log({
        link: links[i],
        keywordCombinations: keywordArr,
        videoData: videos,
        keywordData: isKeywordPresent,
      });

      search.visitResults.push({
        link: links[i],
        keywordCombinations: keywordArr,
        videoData: videos,
        keywordData: isKeywordPresent,
      });
      await search.save();
    } catch (error) {
      console.log(error);
      continue;
    }
  }

  //   close browser
  await browser.close();
  return true;
};

// visitEachLinkScraper(links, keyword, "lorem");

process
  .on("unhandledRejection", (reason, p) => {
    console.error(reason, "Unhandled Rejection at Promise", p);
  })
  .on("uncaughtException", (err) => {
    console.error(err, "Uncaught Exception thrown");
    process.exit(1);
  });

module.exports = visitEachLinkScraper;
