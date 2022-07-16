const Settings = require("../../models/Settings");
const settingFndCont = require("./find");
const { siteData } = require("./shared");
const { dE } = require("../../shared/shared");

const addNew = async (req, res) => {
  try {
    const newSettings = await new Settings(siteData(req)).save();
    req.newSetting = newSettings;
    settingFndCont.findById(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { addNew };
