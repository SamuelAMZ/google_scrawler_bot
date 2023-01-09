// paginate in google search results pages
// grab results
// and return in at the end

// functions
const checkForResultFound = require("./checkIfResultFound");
const grabResults = require("./grabResults");
const paginateNext = require("./paginateToNext");

const paginateAndReturnResults = async (page) => {
  // check if results found
  const isResults = checkForResultFound(page);

  //   check only for the first page of google
  //   if there is no result, just stop the scraper
  if (!isResults) {
    return false;
  }

  //   then can loop
  // if there is result grab and loop
  const allResults = [];
  let continueLoop = true;

  let numberOfRun = 0;

  while (continueLoop) {
    numberOfRun++;
    console.log("run loop " + numberOfRun + " times");

    // 10 runs stop the loop
    if (numberOfRun === 20) {
      // stop loop
      continueLoop = false;
      break;
    }

    // grab results
    const results = await grabResults(page);

    if (!results) {
      // stop loop
      continueLoop = false;
      //   reset run counter
      numberOfRun = 0;
      console.log("grab stop the loop");
      break;
    }

    console.log(results.length);
    allResults.push(...results);

    // paginate to next
    const isNextAvailable = await paginateNext(page);
    if (!isNextAvailable) {
      // stop loop
      continueLoop = false;
      //   reset run counter
      numberOfRun = 0;
      console.log("paginate stop the loop");
      break;
    }
  }

  if (allResults.length >= 1) {
    return allResults;
  } else {
    return false;
  }
};

module.exports = paginateAndReturnResults;
