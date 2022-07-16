const filterInProductModel = (queryReq) => {
  let query = {};
  query.category = queryReq.category;
  query.subCategory = queryReq.subCategory;
  query.brand = queryReq.brand;
  let orQuery = {
    $or: [
      { "title.en": { $regex: queryReq.product, $options: "i" } },
      { "title.ar": { $regex: queryReq.product, $options: "i" } },
      { "description.en": { $regex: queryReq.product, $options: "i" } },
      { "description.ar": { $regex: queryReq.product, $options: "i" } },
    ],
  };
  let queryFind = {
    $and: [
      orQuery,
      { categoryId: query.category },
      { subCategory: query.subCategory },
      { brand: query.brand },
    ],
  };
  return queryFind;
};

const SearchInShopPage = (queryReq) => {
  let query = {};
  query.$and = [];
  if (query.product !== "") {
    query.$and.push({
      "title.en": { $regex: queryReq.product, $options: "i" },
    });
  }
  if (queryReq.category !== "") {
    query.$and.push({ categoryId: queryReq.category });
  }
  if (queryReq.subCategory !== "") {
    query.$and.push({ subCategory: queryReq.subCategory });
  }
  if (queryReq.brand !== "") {
    query.$and.push({ brand: queryReq.brand });
  }
  if (queryReq.from !== "" && queryReq.to !== "") {
    query.$and.push({ price: { $gte: queryReq.from, $lte: queryReq.to } });
  }
  return query;
};

module.exports = { SearchInShopPage, filterInProductModel };
