const Banner = require("../../models/Banner");
const findBannerCont = require("./find");
const { dE } = require("../../shared/shared");

const addNew = async (req, res) => {
  try {
    const new_banner = await new Banner({
      "title.en": req.body.title_en,
      "title.ar": req.body.title_ar,
      image: req.file.path,
      isActive: req.body.isActive,
      showInHome: req.body.showInHome,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    }).save();
    req.isAdded = new_banner;
    findBannerCont.findById(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { addNew };
