// this file will filter all links saved in db

// models
const SkipedDomains = require("../../models/skipedDomains");
const AllLinks = require("../../models/AllLinks");

// imports functions
const pullLinks = require("../helpers/pullLinks");
const detectDomains = require("../helpers/detectDomains");
const filterDomains = require("../helpers/filterDomains");
const filterExactLinks = require("../helpers/filterExactLinks");

const filterLinks = async (docId) => {
  // pull all links based on doc id (helper)
  const allLinks = await pullLinks(docId);
  if (allLinks === "nolink") {
    return { status: "bad", message: "no link found for this keyword" };
  }
  if (allLinks === "error") {
    return { status: "bad", message: "error when pulling links from database" };
  }

  // pull default domains to skip from db
  let toSkipDomains = [];
  try {
    const domains = await SkipedDomains.find();
    toSkipDomains.push(...domains);
  } catch (error) {
    console.log(error);
    toSkipDomains = ["google, wikipedia"];
  }

  // detect all links domain and return them as an array (helper)
  const linksDomains = await detectDomains(allLinks);
  if (linksDomains === "nolink") {
    return {
      status: "bad",
      message: "error extrating domains from result links",
    };
  }

  // filter and skip the matches (helper)
  const filterResult = await filterDomains(linksDomains, toSkipDomains);
  if (filterResult.length < 1) {
    return { status: "bad", message: "no link left after filtering" };
  }

  // pull exact links to skip
  let exactLinks = [];
  try {
    const links = await AllLinks.find();
    exactLinks.push(...links);
  } catch (error) {
    console.log(error);
  }

  if (exactLinks.length >= 1) {
    // filter and skip exact matches (helper)
    const finalFilterResult = await filterExactLinks(allLinks, exactLinks);
    if (finalFilterResult.length < 1) {
      return { status: "bad", message: "no link left after final filtering" };
    }

    return finalFilterResult;
  }

  //   else just return first filter result
  return filterResult;
};

module.exports = filterLinks;
