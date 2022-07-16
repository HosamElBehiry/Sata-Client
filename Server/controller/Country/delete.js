const Country = require("../../models/Country");
const cityDelCont = require("../City/delete");
const cityFndCont = require("../City/find");
const { dE, dSuc } = require("../../shared/shared");

const deleteById = async (req, res) => {
  try {
    cityDelCont.delRelatedCity(req, res);
    const delCnt = await Country.findByIdAndDelete(req.params.id);
    dSuc(res, req.t("DELETED.SUCCESS"));
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// مستخدمها لما اجى امسح بلاد كتيره مع بعض
const deleteMany = async (req, res) => {
  try {
    cityDelCont.delRelatedCity(req, res);
    const delCountries = await Country.deleteMany({ _id: { $in: req.body } });
    cityFndCont.findAll(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { deleteById, deleteMany };
