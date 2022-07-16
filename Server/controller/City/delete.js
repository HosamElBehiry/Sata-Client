const City = require("../../models/City");
const cityFindCont = require("./find");
const { dE, dSuc } = require("../../shared/shared");

const deleteById = async (req, res) => {
  try {
    const delCity = await City.findByIdAndDelete(req.params.id);
    dSuc(res, req.t("DELETED.SUCCESS"));
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// المفروض انه لما يمسح بلد كل المدن اللى البلد بتاعتها كذا تتمسح
// انا هنا عامل الشرط عشان لما اجى امسح كذا مدينه الكذا بلد اللى مرتبطه بيها تتمسح هى كمان الاول قبل مالبلد تتمسح
const delRelatedCity = async (req, res) => {
  try {
    const relatedCities = await City.deleteMany({
      country: req.body ? { $in: req.body } : req.params.id,
    });
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

const deleteMany = async (req, res) => {
  try {
    const delCity = await City.deleteMany({ _id: { $in: req.body } });
    cityFindCont.findAll(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { deleteById, delRelatedCity, deleteMany };
