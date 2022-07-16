const Categories = require("../../models/Categories");
const catFindCont = require("./find");
const { dE } = require("../../shared/shared");

const deleteById = async (req, res) => {
  try {
    const delCategory = await Categories.findByIdAndUpdate(req.params.id, {
      $set: { isDeleted: true },
    });
    catFindCont.findById(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// soft delete for many category ...
const deleteMany = async (req, res) => {
  try {
    const delCats = await Categories.updateMany(
      { _id: { $in: req.body } },
      { $set: { isDeleted: true } }
    );
    catFindCont.findAll(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { deleteById, deleteMany };
