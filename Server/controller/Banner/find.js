const Banner = require("../../models/Banner");
const { dE, dSuc } = require("../../shared/shared");

const findById = async (req, res) => {
  try {
    const bannerData = await Banner.findById(
      req.isAdded ? req.isAdded._id : req.params.id
    );
    dSuc(res, bannerData);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

const findAll = async (req, res) => {
  try {
    const banners = await Banner.find();
    dSuc(res, banners);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// مستخدمها فى الحته بتاعت السايت الجديد اللى هو بالعربى ده
const findByType = async (req, res) => {
  try {
    const filtBanners = await Banner.find(
      req.params.type === "isActive"
        ? { isActive: true, showInHome: false }
        : { showInHome: true, isActive: false }
    );
    dSuc(res, filtBanners);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { findById, findAll, findByType };
