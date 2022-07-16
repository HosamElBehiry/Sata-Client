const mongoose = require("mongoose");

const SubCategorySchema = mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    image: {
      type: String,
    },
    title: {
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", SubCategorySchema);
