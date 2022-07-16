const mongoose = require("mongoose");
const BrandSchema = mongoose.Schema(
  {
    title: {
      en: {
        type: String,
      },
      ar: {
        type: String,
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    image: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Brand", BrandSchema);
