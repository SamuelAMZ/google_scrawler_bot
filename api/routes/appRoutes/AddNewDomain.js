const express = require("express");
const NewDomainRoute = express.Router();

// models
const SkipedDomains = require("../../../models/skipedDomains");

// library
const Joi = require("@hapi/joi");

const schema = Joi.object({
  domain: Joi.string().max(1024).required(),
});

NewDomainRoute.post("/", async (req, res) => {
  const { domain } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      domain,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
    return;
  }

  //   creating new post
  const aDomain = new SkipedDomains({
    domains: domain,
  });

  //   save
  try {
    await aDomain.save();

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

module.exports = NewDomainRoute;
