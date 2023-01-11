// this file will remove all matches domain from the arr

const filterExactLinks = async (allLinks, exactLinks) => {
  // loop in and when something do not match you can push it to the filtered array
  let res = allLinks.filter((item) => !exactLinks.includes(item));
  return res;
};

module.exports = filterExactLinks;
