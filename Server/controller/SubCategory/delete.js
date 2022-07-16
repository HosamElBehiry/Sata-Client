const SubCategory = require("../../models/SubCategory");
const subCatFindCont = require("./find");
const { dE } = require("../../shared/shared");

const deleteById = async (req, res) => {
  try {
    const delSubCat = await SubCategory.findByIdAndUpdate(req.params.id, {
      $set: { isDeleted: true },
    });
    subCatFindCont.findById(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

const deleteMany = async (req, res) => {
  try {
    const dltMny = await SubCategory.updateMany(
      { _id: { $in: req.body } },
      { $set: { isDeleted: true } }
    );
    subCatFindCont.findByCatId(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { deleteById, deleteMany };
