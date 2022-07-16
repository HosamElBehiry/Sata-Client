const Banner = require("../../models/Banner");
const bannerFndCont = require("./find");
const { dE } = require("../../shared/shared");

const updateById = async (req, res) => {
  try {
    const updBan = await Banner.findByIdAndUpdate(req.params.id, {
      $set: {
        "title.en": req.body.title_en,
        "title.ar": req.body.title_ar,
        image: req.file ? req.file.path : req.body.image,
        isActive: req.body.isActive,
        showInHome: req.body.showInHome,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      },
    });
    bannerFndCont.findById(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { updateById };
