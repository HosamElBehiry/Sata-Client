const MobileSliders = require("../../models/MobileSlider");
const sliderFindCont = require("./find");
const { dE } = require("../../shared/shared");

const addNew = async (req, res) => {
  try {
    const new_slider = await new MobileSliders({
      "title.en": req.body.title_en,
      "title.ar": req.body.title_ar,
      image: req.file.path,
      isActive: req.body.isActive,
      isMobile: req.body.isMobile,
    }).save();
    req.isAdded = new_slider;
    sliderFindCont.findById(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { addNew };
