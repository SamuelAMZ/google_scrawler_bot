// pull all links based on document id

// db models imports
const AllLinks = require("../../models/AllLinks");

const pullLinks = async (docId) => {
  try {
    const allLinks = await AllLinks.findById(docId);

    if (!allLinks) {
      return "nolink";
    }

    return allLinks.allResults;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

module.exports = pullLinks;
