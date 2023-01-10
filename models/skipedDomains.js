const mongoose = require("mongoose");

const skipedDomains = new mongoose.Schema({
  domains: {
    type: Array,
  },
});

module.exports = mongoose.model("SkipedDomains", skipedDomains);
