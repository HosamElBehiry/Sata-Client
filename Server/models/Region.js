const mongoose = require("mongoose");
const RegionModel = mongoose.Schema({
  region: {
    en: { type: String, require: true, unique: true },
    ar: {
      type: String,
      require: true,
      unique: true,
    },
  },
  cityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
  },
  price: {
    type: Number,
    required: true,
  },
  countryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
  },
});
module.exports = mongoose.model("Region", RegionModel);
