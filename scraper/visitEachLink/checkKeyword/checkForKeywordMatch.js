// this file wills erach in the 3 sentences array and will return a true if there is any match or a false if not

const checkForKeywordMatch = (arr1, arr2, arr3, keywordArr) => {
  let matches = [];

  keywordArr.forEach((elm) => {
    // arr1
    arr1.forEach((word) => {
      if (elm.toLowerCase().trim() === word.toLowerCase().trim()) {
        matches.push(word);
      }
    });

    // arr2
    arr2.forEach((word) => {
      if (elm.toLowerCase().trim() === word.toLowerCase().trim()) {
        matches.push(word);
      }
    });

    // arr3
    arr3.forEach((word) => {
      if (elm.toLowerCase().trim() === word.toLowerCase().trim()) {
        matches.push(word);
      }
    });
  });

  return matches.length > 0
    ? { match: true, count: matches.length }
    : { match: false, count: 0 };
};

module.exports = checkForKeywordMatch;
