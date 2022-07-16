const Brand = require("../../models/Brand");
const { dE, dSuc } = require("../../shared/shared");

const findById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id).populate(
      "category",
      "title"
    );
    dSuc(res, brand);
  } catch (error) {
    dE;
  }
};

// filter by category id
const filterByCategory = async (req, res) => {
  try {
    const filterBrands = await Brand.find({
      isDeleted: false,
      category: req.params.id,
    }).select("title");
    dSuc(res, filterBrands);
  } catch (error) {
    dE(res, req.t("DISPALY.ERROR"));
  }
};

module.exports = { findById, filterByCategory };
