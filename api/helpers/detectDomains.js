// this detect all links domain name one by one and return the domain in an array

// imports
const extractDomain = require("extract-domain");

const detectDomains = async (links) => {
  if (links.length < 1) {
    return "nolink";
  }

  const domains = extractDomain(links);
  return domains;
};

module.exports = detectDomains;
