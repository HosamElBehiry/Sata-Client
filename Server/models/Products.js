const mongoose = require("mongoose");
const ProductShema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    image: {
      type: String,
      default: "",
    },
    title: {
      en: {
        type: String,
      },
      ar: {
        type: String,
      },
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    description: {
      en: {
        type: String,
      },
      ar: {
        type: String,
      },
    },
    price: {
      type: Number,
      required: true,
    },
    color: {
      type: [String],
    },
    size: {
      type: [String],
    },
    store: {
      type: Number,
      default: 1,
    },
    sale: {
      // الخصم
      type: Number,
      default: 0,
    },
    onsale: {
      // هل عليها خصم ولا لا ؟
      type: Boolean,
      default: false,
    },
    status: {
      // lms tb2a false not displayed in Bonik, else ok display it
      type: Boolean,
      default: false,
    },
    rate: {
      all: {
        type: [Number],
        default: [],
      },
      value: {
        type: Number,
        default: 0,
      },
    },
    visitedBy: {
      type: [String],
    },
    low: {
      // اللى هو البند بتاع المخزون المنخفض
      type: Number,
      default: 1,
    },
    bought: {
      // بتاعت استعراض المنتجات الاكثر مبيعا
      type: Number,
      default: 0,
    },
    isApproved: {
      // لما ييجى العامل يضيف المنتج ميتوافقش عليه على طول الا لما البائع بتاعها الاصلى يوافق عليها
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Products", ProductShema);
