const express = require("express");
const NewSearchRoute = express.Router();

// models
const Searches = require("../../models/Searches");
const Analytics = require("../../models/Analytics");

// library
const Joi = require("@hapi/joi");

// scrapper
const scrapper = require("../../scraper/index");

const schema = Joi.object({
  keyword: Joi.string().max(1024).required(),
  numberOfPages: Joi.string().max(1024).required(),
  urls: Joi.array().required(),
  domains: Joi.array().required(),
});

NewSearchRoute.post("/", async (req, res) => {
  const { keyword, numberOfPages, urls, domains } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      keyword,
      numberOfPages,
      urls,
      domains,
    });
  } catch (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  //   creating new post
  const search = new Searches({
    keyword: keyword,
    exactLinks: urls,
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
    const result = await scrapper(keyword, numberOfPages);

    if (!result) {
      await search.updateOne({ isResultFound: false });

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
