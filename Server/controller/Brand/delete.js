const Brand = require("../../models/Brand");
const brandFindCont = require("./find");
const brandFindAll = require("./brand");
const { dE } = require("../../shared/shared");

const deleteById = async (req, res) => {
  try {
    const brandData = await Brand.findByIdAndUpdate(req.params.id, {
      $set: { isDeleted: true },
    });
    brandFindCont.findById(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

//  سوفت ديليت لكذا علامه تجاريه
const deleteMany = async (req, res) => {
  try {
    const dltBrnds = await Brand.updateMany(
      { _id: { $in: req.body } },
      { $set: { isDeleted: true } }
    );
    brandFindAll.getAll(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { deleteById, deleteMany };
