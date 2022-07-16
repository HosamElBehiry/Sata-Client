const mongoose = require("mongoose");
const ReturnedProducts = mongoose.Schema(
  {
    ordItm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Refused"],
      default: "Pending",
    },
    shipping: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("ReturnedProducts", ReturnedProducts);
