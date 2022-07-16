const SubCategory = require("../../models/SubCategory");
const { dE, dSuc } = require("../../shared/shared");

const findById = async (req, res) => {
  try {
    const subCatId = await SubCategory.findById(
      req.newSubCategory ? req.newSubCategory._id : req.params.id
    );
    dSuc(res, subCatId);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

const findByCatId = async (req, res) => {
  try {
    const filterSub = await SubCategory.find({
      isDeleted: false,
      category: req.params.id,
    }).populate("category", "title");
    dSuc(res, filterSub);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// مستخدمها فى السايت العربى فى الصقحه بتاعت السيرش
const findAll = async (req, res) => {
  try {
    const allSubs = await SubCategory.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $project: {
          title: 1,
        },
      },
    ]);
    dSuc(res, allSubs);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { findById, findByCatId, findAll };
