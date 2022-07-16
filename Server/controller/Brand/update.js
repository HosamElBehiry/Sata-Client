const Brand = require("../../models/Brand");
const brandFindCont = require("./find");
const { dE } = require("../../shared/shared");

const updateById = async (req, res) => {
  try {
    const { title_en, title_ar, category, image } = req.body;
    const updBrand = await Brand.findByIdAndUpdate(req.params.id, {
      $set: {
        "title.en": title_en,
        "title.ar": title_ar,
        category,
        image: req.file ? req.file.path : image,
        isDeleted: req.body.isDeleted,
      },
    });
    brandFindCont.findById(req, res);
  } catch (error) {
    dE(res, req.t(" DISPLAY.ERROR"));
  }
};

module.exports = { updateById };
