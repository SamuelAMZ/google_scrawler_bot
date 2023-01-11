// pull all links based on document id

// db models imports
const Searches = require("../../models/Searches");

const pullLinks = async (docId) => {
  try {
    const searches = await Searches.findById(docId);

    if (!searches) {
      return "nolink";
    }

    return searches;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

module.exports = pullLinks;
