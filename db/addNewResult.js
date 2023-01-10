// add new data or update those that need to be updated
const AllLinks = require("../models/AllLinks");

const addNewResult = async (newItem) => {
  // else just add new record
  const allLinks = new AllLinks(newItem);
  try {
    await allLinks.save();
    console.log(`${newItem.keyword} added`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = addNewResult;
