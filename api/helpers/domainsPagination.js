// will search and return keyword results,a dn total item found

// model
const SkipedDomains = require("../../models/skipedDomains");

const domainPagination = async (searchKeyword, page, perPage) => {
  try {
    const list = await SkipedDomains.find({
      domains: { $regex: searchKeyword, $options: "i" },
    })
      .sort([["createdAt", -1]])
      .skip(Number(page) * Number(perPage))
      .limit(Number(perPage));

    const totalItems = await SkipedDomains.find({
      domains: { $regex: searchKeyword, $options: "i" },
    });
    const totalItemsLength = totalItems.length;

    return {
      list,
      total: totalItemsLength,
    };
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = domainPagination;
