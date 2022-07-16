const MobileSlider = require("../../models/MobileSlider");
const mobileSliderFindCont = require("./find");
const { dE, dSuc } = require("../../shared/shared");

const deleteById = async (req, res) => {
  try {
    const delSlider = await MobileSlider.findByIdAndDelete(req.params.id);
    dSuc(res, req.t("DELETED.SUCCESS"));
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// delete many sliders ...
const deleteMany = async (req, res) => {
  try {
    const dltSliders = await MobileSlider.deleteMany({
      _id: { $in: req.body },
    });
    mobileSliderFindCont.findAll(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { deleteById, deleteMany };
