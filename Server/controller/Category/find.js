const Categories = require("../../models/Categories");
const { dE, dSuc } = require("../../shared/shared");

const findById = async (req, res) => {
  try {
    const catId = await Categories.findById(req.params.id).select(
      "-subCategories"
    );
    dSuc(res, catId);
  } catch (error) {
    dE(res, req.t("DISPLAY.SUCCESS"));
  }
};

const findAll = async (req, res) => {
  try {
    const category = await Categories.find({
      isDeleted: req.query.isDeleted,
    })
      .populate("subCategories")
      .sort({ title: 1 });
    dSuc(res, category);
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

module.exports = { findById, findAll };
