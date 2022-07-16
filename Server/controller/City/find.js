const { dE, dSuc } = require("../../shared/shared");
const City = require("../../models/City");

const findById = async (req, res) => {
  try {
    const cityId = await City.findById(
      req.newCity ? req.newCity._id : req.params.id
    );
    dSuc(res, cityId);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

const findAll = async (req, res) => {
  try {
    const allCities = await City.find().populate("country", "country -_id");
    dSuc(res, allCities);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// دى بتجيب كل المدن لبلد معينه
const citiesRelated = async (req, res) => {
  try {
    const citiesData = await City.find({ country: req.params.id }).select(
      "-country -__v"
    );
    dSuc(res, citiesData);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { findById, citiesRelated, findAll };
