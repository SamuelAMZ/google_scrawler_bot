// this detect all links domain name one by one and return the domain in an array

// imports
const extractDomain = require("extract-domain");

const detectDomains = async (links) => {
  if (links.length < 1) {
    return "nolink";
  }

  // links
  const actualLinks = [];
  links.forEach((lin) => {
    actualLinks.push(lin.link);
  });

  const domains = extractDomain(actualLinks);

  let readyArr = [];
  domains.forEach((elm, idx) => {
    readyArr.push({ text: links[idx].text, link: elm });
  });

  return readyArr;
};

module.exports = detectDomains;
