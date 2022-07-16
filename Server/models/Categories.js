const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema(
  {
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
    showInMenu: {
      type: Boolean,
      default: true,
    },
    showInHomepage: {
      type: Boolean,
      default: false,
    },
    subCategories: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "SubCategory",
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

module.exports = mongoose.model("Category", CategorySchema);
