const mongoose = require("mongoose");
const RatingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rate: {
      type: Number,
      default: 0,
      required: true,
    },
    comment: {
      type: String,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    },
    status: {
      type: String,
      enum: ["Pending", "Blocked", "Confirmed"],
      default: "Pending",
    },
    delivery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Delivery",
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Rate", RatingSchema);
