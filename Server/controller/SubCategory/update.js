const SubCategory = require("../../models/SubCategory");
const findCont = require("./find");
const { dE } = require("../../shared/shared");

const updateById = async (req, res) => {
  try {
    const { title_en, title_ar, category, image } = req.body;
    const updSubCat = await SubCategory.updateOne(
      { _id: req.params.id },
      {
        $set: {
          "title.en": title_en,
          "title.ar": title_ar,
          category,
          image: req.file ? req.file.path : image,
        },
      }
    );
    findCont.findById(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};
module.exports = { updateById };
