// this file will return an array of all possible combination of the keyword

const returnkeywordArray = (keyword) => {
  // split the keyword base on " "
  const allKeyword = keyword.split(" ");
  // check if the length is greater that 1
  const isGreaterThen1 = allKeyword.length > 1;

  // if no return the array
  if (!isGreaterThen1) {
    return allKeyword;
  }

  // if yes
  function permutations(k, curr_perm, included_items_hash) {
    if (k == 0) {
      perm.push(curr_perm);
      return;
    }

    for (let i = 0; i < items.length; i++) {
      // so that we do not repeat the item, using an array here makes it O(1) operation
      if (!included_items_hash[i]) {
        included_items_hash[i] = true;
        permutations(k - 1, curr_perm + " " + items[i], included_items_hash);
        included_items_hash[i] = false;
      }
    }
  }

  let items = allKeyword;
  let perm = [];

  // for generating different lengths of permutations
  for (let i = 0; i < items.length; i++) {
    permutations(items.length - i, "", []);
  }

  const combinationsArr = [];
  perm.forEach((elm) => {
    combinationsArr.push(elm.trim());
  });

  return combinationsArr;
};

module.exports = returnkeywordArray;
