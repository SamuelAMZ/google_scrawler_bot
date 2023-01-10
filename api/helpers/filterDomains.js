// this file will remove all matches domain from the arr

const filterDomains = async (allDomains, toSkipDomains) => {
  // loop in and when something do not match you can push it to the filtered array
  const filterdArray = [];

  for (let i = 0; i < allDomains.length; i++) {
    for (let y = 0; y < toSkipDomains.length; y++) {
      if (
        allDomains[i].trim().toLowerCase() !==
        toSkipDomains[y].trim().toLowerCase()
      ) {
        filterdArray.push(allDomains[i].trim().toLowerCase());
      }
    }
  }

  return filterdArray;
};

module.exports = filterDomains;
