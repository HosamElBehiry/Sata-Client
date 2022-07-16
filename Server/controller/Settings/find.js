const Settings = require("../../models/Settings");
const { dE, dSuc } = require("../../shared/shared");

const findById = async (req, res) => {
  try {
    const setting = await Settings.findById(
      req.newSetting ? req.newSetting._id.toString() : req.params.id
    );
    dSuc(res, setting);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { findById };
