const Country = require("../../models/Country");
const findCityCont = require("./find");
const { dE } = require("../../shared/shared");

const addNew = async (req, res) => {
  try {
    const { name_en, name_ar } = req.body;
    const new_country = new Country({
      "country.en": name_en,
      "country.ar": name_ar,
      image: req.file.path,
    });
    req.newCountry = await new_country.save();
    findCityCont.findById(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { addNew };
