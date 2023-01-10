// this file will remove all matches domain from the arr

const filterExactLinks = async (allLinks, exactLinks) => {
  // loop in and when something do not match you can push it to the filtered array
  const filterdArray = [];

  for (let i = 0; i < allLinks.length; i++) {
    for (let y = 0; y < exactLinks.length; y++) {
      if (
        allLinks[i].trim().toLowerCase() !== exactLinks[y].trim().toLowerCase()
      ) {
        filterdArray.push(allLinks[i].trim().toLowerCase());
      }
    }
  }

  return filterdArray;
};

module.exports = filterExactLinks;
