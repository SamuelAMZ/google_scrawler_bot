// will search and return keyword results,a dn total item found

// model
const Users = require("../../models/Users");

const searchPagination = async (searchKeyword, page, perPage) => {
  try {
    const list = await Users.find(
      {
        tags: { $regex: searchKeyword, $options: "i" },
      },
      { tags: 1, username: 1, legalStatus: 1, createdAt: 1 }
    )
      .sort([["createdAt", -1]])
      .skip(Number(page) * Number(perPage))
      .limit(Number(perPage));

    const totalItems = await Users.find(
      {
        tags: { $regex: searchKeyword, $options: "i" },
      },
      { tags: 1 }
    );
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

module.exports = searchPagination;
