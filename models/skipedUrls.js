const mongoose = require("mongoose");

const skipedUrls = new mongoose.Schema(
  {
    urls: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SkipedUrls", skipedUrls);
