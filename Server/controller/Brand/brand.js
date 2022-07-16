const Brand = require("../../models/Brand");
const { dE } = require("../../shared/shared");

const getAll = async (req, res) => {
  try {
    const brands = await Brand.find({
      isDeleted: req.query.isDeleted,
    }).populate("category");
    res.status(200).json(brands);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

const addNew = async (req, res, next) => {
  try {
    const newBrand = new Brand({
      "title.en": req.body.title_en,
      "title.ar": req.body.title_ar,
      category: req.body.category,
      image: req.file && req.file.path,
    });
    const result = await newBrand.save();
    req.newBrand = result;
    next();
  } catch (error) {
    dE(res, error);
  }
};

module.exports = { getAll, addNew };
