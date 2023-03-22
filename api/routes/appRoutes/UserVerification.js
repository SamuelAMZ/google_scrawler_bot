const express = require("express");
const UserVerificationRoute = express.Router();
const Users = require("../../../models/Users");
const Joi = require("@hapi/joi");

const schema = Joi.object({
  uid: Joi.string().max(1024).required(),
});

UserVerificationRoute.post("/", async (req, res) => {
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
    const user = await Users.findOne({ _id: uid });
    if (!user) {
      return res.status(400).json({
        message: `error finding single user details`,
        code: "bad",
      });
    }

    const userDetails = {
      url: user.verificationUrl,
    };

    // send 200 response
    return res.status(200).json({
      message: `successfully fetched user`,
      code: "ok",
      payload: userDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `error with finding user`,
    });
  }
});

module.exports = UserVerificationRoute;
