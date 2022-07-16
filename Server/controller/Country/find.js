const Country = require("../../models/Country");
const { dE, dSuc } = require("../../shared/shared");

const findAll = async (req, res) => {
  try {
    const all = await Country.find();
    dSuc(res, all);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

const findById = async (req, res) => {
  try {
    const countryId = await Country.findById(
      req.newCountry ? req.newCountry._id.toString() : req.params.id
    );
    dSuc(res, countryId);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { findAll, findById };
