const express = require("express");
const DownloadCsvRoute = express.Router();
const Searches = require("../../../models/Searches");
const Joi = require("@hapi/joi");

const schema = Joi.object({
  id: Joi.string().max(1024).required(),
  keyword: Joi.boolean().required(),
  urls: Joi.boolean().required(),
  keywordReport: Joi.boolean().required(),
  videoReport: Joi.boolean().required(),
  date: Joi.boolean().required(),
});

DownloadCsvRoute.post("/", async (req, res) => {
  const { id, keyword, urls, keywordReport, videoReport, date } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      id,
      keyword,
      urls,
      keywordReport,
      videoReport,
      date,
    });
  } catch (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  const projection = {
    keyword: keyword ? 1 : 0,
    visitResults: 1,
    createdAt: 1,
  };

  //   search search id
  try {
    const search = await Searches.findOne({ _id: id }, projection);

    // if no search send 400
    if (!search) {
      return res.status(400).json({
        message: `single search not found`,
        code: "bad",
        payload: "nothing",
      });
    }

    // form filterd data to send
    let dataToSend = {};
    keyword && (dataToSend.keyword = search.keyword);
    date && (dataToSend.date = search.createdAt);
    urls && (dataToSend.urls = search.visitResults.map((elm) => elm.link));
    keywordReport &&
      (dataToSend.keywordReport = search.visitResults.map(
        (elm) => elm.keywordData.isMatch
      ));
    videoReport &&
      (dataToSend.videoReport = search.visitResults.map(
        (elm) => elm.videoData.isVideo
      ));

    return res.status(200).json({
      message: `single search fetched successfully`,
      code: "ok",
      payload: dataToSend,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `server error when searching for single search`,
    });
  }
});

module.exports = DownloadCsvRoute;
