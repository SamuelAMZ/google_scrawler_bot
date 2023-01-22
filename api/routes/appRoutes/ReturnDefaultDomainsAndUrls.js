const express = require("express");
const ReturnDefaultDomainsAndUrlsRoute = express.Router();

// models
const SkipedDomains = require("../../../models/skipedDomains");
const SkipedUrls = require("../../../models/skipedUrls");

ReturnDefaultDomainsAndUrlsRoute.post("/", async (req, res) => {
  //   search search id
  try {
    const domains = await SkipedDomains.find().select("domains");
    const urls = await SkipedUrls.find().select("urls");

    return res.status(200).json({
      message: `defaults fetched`,
      code: "ok",
      payload: {
        domains: domains.map((elm) => elm.domains),
        urls: urls.map((elm) => elm.urls),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `server error when fetching defaults`,
    });
  }
});

module.exports = ReturnDefaultDomainsAndUrlsRoute;
