const Settings = require("../../models/Settings");
const settingFndCont = require("./find");
const { dE } = require("../../shared/shared");
const { siteData } = require("./shared");

const updateById = async (req, res) => {
  try {
    const updSetting = await Settings.findByIdAndUpdate(req.params.id, {
      $set: siteData(req),
    });
    settingFndCont.findById(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { updateById };
