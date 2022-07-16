const Country = require("../../models/Country");
const findCountryCont = require("./find");
const { dE } = require("../../shared/shared");

const updateById = async (req, res) => {
  try {
    const { name_en, name_ar } = req.body;
    const updatedCountry = await Country.findByIdAndUpdate(req.params.id, {
      $set: {
        "country.en": name_en,
        "country.ar": name_ar,
        image: req.file ? req.file.path : req.body.image,
      },
    });
    findCountryCont.findById(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { updateById };
