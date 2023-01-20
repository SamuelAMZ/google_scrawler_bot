const express = require("express");
const NewSearchRoute = express.Router();

// models
const Searches = require("../../../models/Searches");
const Analytics = require("../../../models/Analytics");

// library
const Joi = require("@hapi/joi");

// scrapper
const allTabScraper = require("../../../scraper/googleAllSearch/index");
const videoTabScraper = require("../../../scraper/googleVideoSearch/index");

const schema = Joi.object({
  keyword: Joi.string().max(1024).required(),
  numberOfPages: Joi.string().max(1024).required(),
  tab: Joi.string().max(1024).required(),
  urls: Joi.array().required(),
  domains: Joi.array().required(),
});

NewSearchRoute.post("/", async (req, res) => {
  const { keyword, numberOfPages, tab, urls, domains } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      keyword,
      numberOfPages,
      tab,
      urls,
      domains,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
    return;
  }

  //   creating new post
  const search = new Searches({
    keyword: keyword,
    exactLinks: urls,
    tab: tab,
    domainsLinks: domains,
    numberOfPagesToVisitOnGoogle: numberOfPages,
  });

  //   save
  try {
    await search.save();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error when scraping",
      code: "500",
      error,
    });
  }

  try {
    // launch scrapper
    let result = [];
    if (tab === "all") {
      let allTabResult = await allTabScraper(keyword, numberOfPages);
      result.push(...allTabResult);
    }
    if (tab === "videos") {
      let videoTabResult = await videoTabScraper(keyword, numberOfPages);
      result.push(...videoTabResult);
    }
    if (tab === "both") {
      let allTabResult = await allTabScraper(keyword, numberOfPages);
      let videoTabResult = await videoTabScraper(keyword, numberOfPages);
      result.push(...allTabResult, ...videoTabResult);
    }

    if (!result) {
      await search.updateOne({
        isResultFound: false,
        allResults: result,
        steps: {
          step1: "done!",
          step2: "not started",
          step3: "not started",
        },
      });

      return res.status(201).json({
        message: "step 1 finished successfully",
        code: "ok",
        data: { searchId: search._id },
        isFound: false,
      });
    }

    // update database data
    await search.updateOne({
      isResultFound: true,
      allResults: result,
      steps: {
        step1: "done!",
        step2: "loading...",
        step3: "not started",
      },
      status: "step 2",
    });

    // update analytics
    const analytics = await Analytics.findOne({
      _id: "63bf02470a80c92850af91a6",
    });
    await analytics.updateOne({
      searchCount: analytics.searchCount + 1,
      urlCrawledCount: analytics.urlCrawledCount + result.length,
    });

    return res.status(201).json({
      message: "step 1 finished successfully",
      code: "ok",
      data: { result, searchId: search._id },
      isFound: true,
    });
  } catch (error) {
    console.log(error, "error with scraper");
    return res.status(500).json({
      message: "error when scraping",
      code: "500",
      error,
    });
  }
});

module.exports = NewSearchRoute;
