const express = require("express");
const PaginationRoute = express.Router();

// model
const Searches = require("../../../models/Searches");

// validation lib
const Joi = require("@hapi/joi");

const schema = Joi.object({
  page: Joi.string().max(1024).required(),
  perPage: Joi.string().max(1024).required(),
  searchKeyword: Joi.string().max(1024).allow(""),
});

PaginationRoute.post("/", async (req, res) => {
  const { page, perPage, searchKeyword } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      page,
      perPage,
      searchKeyword,
    });
  } catch (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  //   search search id
  try {
    const list = await Searches.find({
      keyword: { $regex: searchKeyword, $options: "i" },
    })
      .sort([["createdAt", -1]])
      .skip(Number(page) * Number(perPage))
      .limit(Number(perPage));

    // get total result
    const totalItems = await Searches.find({
      keyword: { $regex: searchKeyword, $options: "i" },
    });
    const totalItemsLength = totalItems.length;

    // if no search send 400
    if (!list || !totalItems) {
      return res.status(400).json({
        message: `error listing searches`,
        code: "bad",
        payload: "nothing",
      });
    }

    return res.status(200).json({
      message: `single search fetched successfully`,
      code: "ok",
      payload: { list, totalItemsLength },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `server error when searching for single search`,
    });
  }
});

module.exports = PaginationRoute;
