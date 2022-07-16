const Categories = require("../../models/Categories");
const { dE } = require("../../shared/shared");
const findCont = require("./find");

const updateById = async (req, res) => {
  try {
    const updateCategory = await Categories.updateOne(
      { _id: req.params.id },
      {
        $set: {
          image: req.file ? req.file.path : req.body.image,
          "title.en": req.body.title_en,
          "title.ar": req.body.title_ar,
          showInMenu: req.body.showInMenu,
          showInHomepage: req.body.showInHomepage,
          isDeleted: req.body.isDeleted,
        },
      }
    );
    findCont.findById(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { updateById };
