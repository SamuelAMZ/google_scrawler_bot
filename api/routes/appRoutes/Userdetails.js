const express = require("express");
const UserdetailsRoute = express.Router();
const Users = require("../../../models/Users");
const Membership = require("../../../models/Membership");
const Joi = require("@hapi/joi");

const schema = Joi.object({
  uid: Joi.string().max(1024).required(),
});

UserdetailsRoute.post("/", async (req, res) => {
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

    const userMembership = await Membership.findOne({ uid: uid });
    if (!userMembership) {
      return res.status(400).json({
        message: `error finding single user membership`,
        code: "bad",
      });
    }

    let startH = new Date(Number(userMembership.start));
    let endH = new Date(Number(userMembership.end));

    const userDetails = {
      usernames: user.usernamesArray,
      name: user.name,
      email: user.email,
      verification: user.legalStatus,
      registrationDate: user.createdAt,
      currentPlan: userMembership.plan,
      start: startH,
      end: userMembership.end === "1" ? "1" : endH,
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

module.exports = UserdetailsRoute;
