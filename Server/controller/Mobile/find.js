const MobileSlider = require("../../models/MobileSlider");
const { dE, dSuc } = require("../../shared/shared");

const findById = async (req, res) => {
  try {
    const sliderData = await MobileSlider.findById(
      req.isAdded ? req.isAdded._id : req.params.id
    );
    dSuc(res, sliderData);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// مستخدمها فى الادمن
const findAll = async (req, res) => {
  try {
    const sliders = await MobileSlider.find();
    dSuc(res, sliders);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// مستخدمها فى السايت
const filterBy = async (req, res) => {
  try {
    const filtSlider = await MobileSlider.find(
      req.query.isActive ? { isActive: true } : { isMobile: true },
      { image: 1, title: 1 }
    );
    dSuc(res, filtSlider);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { findById, findAll, filterBy };
