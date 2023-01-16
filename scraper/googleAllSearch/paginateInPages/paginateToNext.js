// paginate to next result 20times
// or stop if next btn is not available

const paginateNext = async (page) => {
  // check if next btn available
  let isAvailable = false;

  try {
    await page.waitForSelector("#pnnext", {
      timeout: 4000,
    });
    isAvailable = true;
  } catch (error) {
    console.log("no next page");
    isAvailable = false;
  }

  // if yes click on it
  try {
    const clickNext = await page.$("#pnnext");
    await clickNext.evaluate((b) => b.click());
  } catch (error) {
    console.log("no more pages");
    return false;
  }

  //   wait for navigation
  await page.waitForSelector(".logo");

  // wait 5sec for result to load
  await page.waitForTimeout(5000);

  return isAvailable;
};

module.exports = paginateNext;
