const express = require("express");
const UserUrlsAndDomainsRoute = express.Router();
const UserSkipedDomains = require("../../../models/UserSkipedDomains");
const UserSkipedUrls = require("../../../models/UserSkipedUrls");
const Joi = require("@hapi/joi");

const schema = Joi.object({
  uid: Joi.string().max(1024).required(),
});

UserUrlsAndDomainsRoute.post("/", async (req, res) => {
  const { uid } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      uid,
    });
  } catch (error) {
    res.status(400).json({ message: error.details[0].message, code: "bad" });
    return;
  }

  // get links and keyword from db
  try {
    const userDo = await UserSkipedDomains.find({ uid: uid });
    const userUr = await UserSkipedUrls.find({ uid: uid });

    const userData = {
      urls: userUr ? userUr : [],
      domains: userDo ? userDo : [],
    };

    // send 200 response
    return res.status(200).json({
      message: `successfully fetched user data`,
      code: "ok",
      payload: userData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `error with finding user`,
    });
  }
});

module.exports = UserUrlsAndDomainsRoute;
