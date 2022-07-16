const mongoose = require("mongoose");
const CountryModel = mongoose.Schema(
  {
    country: {
      en: { type: String, require: true, unique: true },
      ar: {
        type: String,
        require: true,
        unique: true,
      },
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Country", CountryModel);
