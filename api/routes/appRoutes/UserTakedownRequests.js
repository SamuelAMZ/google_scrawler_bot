const express = require("express");
const UserTakedownRequestsRoute = express.Router();
const UserReportLeak = require("../../../models/UserReportLeak");
const Joi = require("@hapi/joi");

const schema = Joi.object({
  uid: Joi.string().max(1024).required(),
});

UserTakedownRequestsRoute.post("/", async (req, res) => {
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
    const leaks = await UserReportLeak.find({ uid });
    if (!leaks) {
      return res.status(400).json({
        message: `error finding single user leakes reports`,
        code: "bad",
      });
    }

    // send 200 response
    return res.status(200).json({
      message: `successfully fetched user leaks`,
      code: "ok",
      payload: leaks.reverse(),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `error with finding user`,
    });
  }
});

module.exports = UserTakedownRequestsRoute;
