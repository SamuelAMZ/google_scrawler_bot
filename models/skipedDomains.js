const mongoose = require("mongoose");

const skipedDomains = new mongoose.Schema(
  {
    domains: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SkipedDomains", skipedDomains);
