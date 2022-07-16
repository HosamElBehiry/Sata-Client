const SubCategory = require("../../models/SubCategory");
const { dE } = require("../../shared/shared");

const addNew = async (req, res, next) => {
  const { category, title_en, title_ar } = req.body;
  const newSubCategory = new SubCategory({
    category,
    "title.en": title_en,
    "title.ar": title_ar,
    image: req.file.path,
  });
  try {
    const result = await newSubCategory.save();
    req.newSubCategory = result;
    next();
  } catch (error) {
    dE(res, error);
  }
};

module.exports = { addNew };
