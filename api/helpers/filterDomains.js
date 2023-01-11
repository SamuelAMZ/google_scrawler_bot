// this file will remove all matches domain from the arr

const filterDomains = async (allDomains, toSkipDomains, allLinks) => {
  let res = allDomains.filter((item) => !toSkipDomains.includes(item.link));

  // search and find the right links
  let arr = [];
  res.forEach((tr) => {
    allLinks.forEach((elm) => {
      if (tr.text === elm.text && !arr.includes(elm.link)) {
        arr.push(elm.link);
      }
    });
  });

  return arr;
};

module.exports = filterDomains;
