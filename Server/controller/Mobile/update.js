const MobileSlider = require("../../models/MobileSlider");
const sliderFindCont = require("./find");
const { dE } = require("../../shared/shared");

const updateById = async (req, res) => {
  try {
    const updSlider = await MobileSlider.findByIdAndUpdate(req.params.id, {
      $set: {
        "title.en": req.body.title_en,
        "title.ar": req.body.title_ar,
        image: req.file ? req.file.path : req.body.image,
        isActive: req.body.isActive,
        isMobile: req.body.isMobile,
      },
    });
    sliderFindCont.findById(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { updateById };
