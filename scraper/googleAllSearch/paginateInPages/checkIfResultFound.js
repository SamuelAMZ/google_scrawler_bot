// check if the search get to a result

const checkForResultFound = async (page) => {
  try {
    const sel = await page.waitForSelector("#rso", {
      timeout: 4000,
    });
    return true;
  } catch (error) {
    console.log("no result from check");
    return false;
  }
};

module.exports = checkForResultFound;
