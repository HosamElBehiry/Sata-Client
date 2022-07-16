const mongoose = require("mongoose");
const VendorSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    taxcard_front: {
      type: String,
      default: "",
    },
    taxcard_back: {
      type: String,
      default: "",
    },
    taxcard_expiration: {
      type: String,
      default: "",
    },
    commercialRecord: {
      type: String,
      default: "",
    },
    commericalRecord_expiration: {
      type: String,
      default: "",
    },
    workers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Worker",
    },
    app_balance_type: {
      type: String,
      enum: ["fixed", "percentage"],
      default: "percentage",
    },
    app_balance_amount: {
      type: Number,
      default: 10,
    },
    numberOfDeliverdOrders: {
      type: Number,
      default: 0,
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
    Profits: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Bill",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Vendor", VendorSchema);
