const express = require("express");
const FilterResultRoute = express.Router();
const Searches = require("../../models/Searches");
const Joi = require("@hapi/joi");

// functions
const filterLinks = require("../contollers/filterResults");

const schema = Joi.object({
  id: Joi.string().max(1024).required(),
});

FilterResultRoute.post("/", async (req, res) => {
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

    if (search.exactLinks[0] === "" && search.domainsLinks[0] === "") {
      // give the same urls as the original ones
      let dataArr = [];
      search.allResults.forEach((elm) => {
        dataArr.push(elm.link);
      });

      await search.updateOne({
        filtered: dataArr,
        steps: {
          step1: "done!",
          step2: "done!",
          step3: "loading...",
        },
      });

      const updated = await Searches.findOne({ _id: id });

      // send res
      return res.status(200).json({
        message: `single search fetched successfully`,
        code: "ok",
        payload: updated,
      });
    }

    // filter result
    const filtered = await filterLinks(id);

    if (filtered) {
      await search.updateOne({
        steps: {
          step1: "done!",
          step2: "done!",
          step3: "loading...",
        },
      });

      const updated = await Searches.findOne({ _id: id });

      return res.status(200).json({
        message: `single search fetched successfully`,
        code: "ok",
        payload: updated,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `server error when filtering search`,
    });
  }
});

module.exports = FilterResultRoute;
