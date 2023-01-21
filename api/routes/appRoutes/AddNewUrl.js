const express = require("express");
const NewUrlRoute = express.Router();

// models
const SkipedUrls = require("../../../models/skipedUrls");

// library
const Joi = require("@hapi/joi");

const schema = Joi.object({
  url: Joi.string().max(1024).required(),
});

NewUrlRoute.post("/", async (req, res) => {
  const { url } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      url,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
    return;
  }

  //   creating new post
  const anUrl = new SkipedUrls({
    urls: url,
  });

  //   save
  try {
    await anUrl.save();

    return res.status(201).json({
      message: "added successfully",
      code: "ok",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error when scraping",
      code: "500",
      error,
    });
  }
});

module.exports = NewUrlRoute;
