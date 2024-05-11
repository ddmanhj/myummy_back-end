function transformWishList(getWishList) {
  return getWishList.reduce((acc, curr) => {
    if (Array.isArray(acc.dishesID)) {
      acc.dishesID.push(curr.dishesID);
    } else {
      acc.dishesID = [curr.dishesID];
    }

    return acc;
  }, {});
}

module.exports = transformWishList;
