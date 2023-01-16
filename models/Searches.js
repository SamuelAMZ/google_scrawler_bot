const mongoose = require("mongoose");

const searches = new mongoose.Schema(
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
    exactLinks: {
      type: Array,
      default: [],
    },
    domainsLinks: {
      type: Array,
      default: [],
    },
    numberOfPagesToVisitOnGoogle: {
      type: String,
      default: 20,
    },
    isResultFound: {
      type: Boolean,
    },
    steps: {
      type: Object,
      default: {
        step1: "scraping...",
        step2: "not started",
        step3: "not started",
      },
    },
    status: {
      type: String,
      default: "step 1",
    },
    visitResults: {
      type: Array,
      default: [],
    },
    linksStats: {
      type: Object,
      default: {
        allLinksCount: 0,
        visitedCount: 0,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Searches", searches);
