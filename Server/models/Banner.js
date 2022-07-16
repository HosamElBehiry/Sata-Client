const mongoose = require("mongoose");
const BannerSchema = mongoose.Schema(
  {
    title: {
      en: {
        type: String,
      },
      ar: {
        type: String,
      },
    },
    image: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    showInHome: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: Date,
      default: Date.now(),
    },
    endDate: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", BannerSchema);
