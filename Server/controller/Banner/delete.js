const Banner = require("../../models/Banner");
const bannerFindCont = require("./find");
const { dE, dSuc } = require("../../shared/shared");

const deleteById = async (req, res) => {
  try {
    const delBan = await Banner.findByIdAndDelete(req.params.id);
    dSuc(res, req.t("DELETED.SUCCESS"));
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

const deleteMany = async (req, res) => {
  try {
    const dltBanners = await Banner.deleteMany({ _id: { $in: req.body } });
    bannerFindCont.findAll(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { deleteById, deleteMany };
