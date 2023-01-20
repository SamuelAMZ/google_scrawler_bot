// grab all available results from current google page

const grabResults = async (page) => {
  // get results div
  let results = "";

  try {
    const resultDiv = await page.waitForSelector("#rso", {
      timeout: 4000,
    });
  } catch (error) {
    console.log("nothing from grab details 1");
  }

  try {
    results = await page.evaluate(() => {
      let resArr = [];

      //   get all result in page
      Array.from(document.querySelector("#rso").children).forEach((elm) => {
        resArr.push({
          text: elm.querySelector("h3").innerText,
          link: elm.querySelector("a").href,
        });
      });

      return resArr;
    });
  } catch (error) {
    console.log("nothing from grab details 2");
  }

  //   //   try to see if first result have a table of results  (children)
  let childrenTable = "";
  //  Array.from(document.querySelector("#rso").children)[0].querySelector("table")
  try {
    childrenTable = await page.evaluate(() => {
      let resArr = [];

      //   get all result in page
      const parentTable = Array.from(
        document.querySelector("#rso").children
      )[0].querySelector("table");

      const childrenTable = Array.from(parentTable.querySelectorAll("tr"));

      childrenTable.forEach((child, idx) => {
        if (idx !== childrenTable.length - 1) {
          resArr.push({
            text: child.querySelector("h3").textContent,
            link: child.querySelector("a").href,
          });
        }
      });

      return resArr;
    });
  } catch (error) {
    console.log("no children results");
  }

  //   push child result into the result
  if (childrenTable.length >= 1) {
    results.push(...childrenTable);
  }

  return results;
};

module.exports = grabResults;
