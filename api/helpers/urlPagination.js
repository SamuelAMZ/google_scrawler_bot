// will search and return keyword results,a dn total item found

// model
const SkipedUrls = require("../../models/skipedUrls");

const urlPagination = async (searchKeyword, page, perPage) => {
  try {
    const list = await SkipedUrls.find({
      urls: { $regex: searchKeyword, $options: "i" },
    })
      .sort([["createdAt", -1]])
      .skip(Number(page) * Number(perPage))
      .limit(Number(perPage));

    const totalItems = await SkipedUrls.find({
      urls: { $regex: searchKeyword, $options: "i" },
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

module.exports = urlPagination;
