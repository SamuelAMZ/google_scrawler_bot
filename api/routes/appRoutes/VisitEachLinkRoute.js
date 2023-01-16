const express = require("express");
const VisiteEachLinkRoute = express.Router();
const Searches = require("../../../models/Searches");
const Joi = require("@hapi/joi");

// scraper
const visitEachLinkScraper = require("../../../scraper/visitEachLink/index");

const schema = Joi.object({
  id: Joi.string().max(1024).required(),
});

VisiteEachLinkRoute.post("/", async (req, res) => {
  const { id } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      id,
    });
  } catch (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  // get links and keyword from db
  try {
    const search = await Searches.findOne({ _id: id });
    if (!search) {
      return res.status(400).json({
        message: `error finding single search details, maybe already removed`,
      });
    }

    let keyword = search.keyword ? search.keyword : "";
    let links = search.filtered ? search.filtered : [];
    let docId = id;

    if (keyword === "" || links.length === 0 || docId === "") {
      return res.status(400).json({
        message: `keyword or filtered array empty`,
      });
    }

    // update status to scraping...
    try {
      search.steps = {
        step1: "done!",
        step2: "done!",
        step3: "scraping...",
      };
      await search.save();
    } catch (error) {
      console.log(error);
    }

    // start scraper with details
    const result = await visitEachLinkScraper(links, keyword, docId);

    if (result) {
      // update db with 3rd step done
      search.status = "done";
      search.steps = {
        step1: "done!",
        step2: "done!",
        step3: "done!",
      };
      await search.save();
    }

    // get the latest version of the doc and send it to frontend
    const latestSearchState = await Searches.findOne({ _id: id });

    // send 200 response
    return res.status(200).json({
      message: `successfully visited all links and details grabed`,
      code: "ok",
      payload: latestSearchState,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `error with finding search`,
    });
  }
});

module.exports = VisiteEachLinkRoute;
