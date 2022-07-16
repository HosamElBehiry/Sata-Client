const mongoose = require("mongoose");
const BillSchema = mongoose.Schema(
  {
    money: {
      type: Number,
      default: 0,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    ordItm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deliverdToVendor: {
      type: Boolean,
      default: false,
    },
    deliverdToSata: {
      type: Boolean,
      default: false,
    },
    // لازم ساتا توافق انها استلمت الفلوس
    acceptedBySata: {
      type: Boolean,
      default: false,
    },
    deliverdAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", BillSchema);
