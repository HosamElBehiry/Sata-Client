const mongoose = require("mongoose");
const CitySchema = mongoose.Schema(
  {
    city: {
      en: {
        type: String,
        required: true,
        unique: true,
      },
      ar: {
        type: String,
        required: true,
        unique: true,
      },
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("City", CitySchema);
