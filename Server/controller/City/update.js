const City = require("../../models/City");
const cityFndCont = require("./find");
const { dE } = require("../../shared/shared");

const updateById = async (req, res) => {
  try {
    const { name_en, name_ar, country } = req.body;
    const updCity = await City.findByIdAndUpdate(req.params.id, {
      $set: {
        "city.en": name_en,
        "city.ar": name_ar,
        country,
      },
    });
    cityFndCont.findById(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { updateById };
