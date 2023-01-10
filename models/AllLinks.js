const mongoose = require("mongoose");

const allLinks = new mongoose.Schema(
  {
    keyword: {
      type: String,
    },
    allResults: {
      type: Array,
      default: [],
    },
    filtered: {
      type: Array,
      default: [],
    },
    keywordOnly: {
      type: Array,
      default: [],
    },
    keywordAndMedia: {
      type: Array,
      default: [],
    },
    mediaOnly: {
      type: Array,
      default: [],
    },
    exactLinks: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AllLinks", allLinks);
