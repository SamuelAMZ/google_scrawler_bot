const express = require("express");
const RemoveSearchRoute = express.Router();
const Searches = require("../../../models/Searches");
const Joi = require("@hapi/joi");

const schema = Joi.object({
  id: Joi.string().max(1024).required(),
});

RemoveSearchRoute.post("/", async (req, res) => {
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

  //   search search id
  try {
    const search = await Searches.findOne({ _id: id });
    // if no search send 400
    if (!search) {
      return res.status(400).json({
        message: `single search not found`,
        code: "bad",
        payload: "nothing",
      });
    }

    // remove search
    try {
      await search.remove();

      return res.status(200).json({
        message: `single search removed successfully`,
        code: "ok",
        payload: "removed",
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: `error removing single search`,
        code: "bad",
        payload: "nothing",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `server error when searching for single search`,
    });
  }
});

module.exports = RemoveSearchRoute;
