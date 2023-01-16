// this page will check if the keyword is present on the target page
const textsArr = require("./returnWordsArr");
const checkForKeywordMatch = require("./checkForKeywordMatch");

const checkForKeywordOnPage = async (page, keywordArr) => {
  const keywords = { isMatch: false, resultCount: 0 };

  // grab all of texts and return an array
  // / get results div
  let allText = [];

  try {
    allText = await page.evaluate(() => {
      let resArr = document.querySelector("body").innerText.split(" ");
      return resArr;
    });
  } catch (error) {
    console.log(error);
  }

  // will return words arrays
  const { sentenceOf1, sentenceOf2, sentenceOf3 } = textsArr(allText);

  //function will try to see if there is a match
  const isMatch = checkForKeywordMatch(
    sentenceOf1,
    sentenceOf2,
    sentenceOf3,
    keywordArr
  );

  // if there is a match return true or else false
  keywords.isMatch = isMatch.match;
  keywords.resultCount = isMatch.count;

  return keywords;
};

module.exports = checkForKeywordOnPage;
