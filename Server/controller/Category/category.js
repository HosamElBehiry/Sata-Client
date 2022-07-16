const Categories = require("../../models/Categories");
const findSubCatCont = require("../SubCategory/find");
const { dE } = require("../../shared/shared");

const addSubCategoryId = async (req, res) => {
  try {
    const addSub = await Categories.updateOne(
      { _id: req.newSubCategory.category.toString() },
      { $push: { subCategories: req.newSubCategory._id.toString() } }
    );
    findSubCatCont.findById(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { addSubCategoryId };
