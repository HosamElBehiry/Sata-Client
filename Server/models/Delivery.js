const mongoose = require("mongoose");
const DeliverySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    licence_front: {
      type: String,
    },
    licence_back: {
      type: String,
    },
    licence_expiration: {
      type: String,
      default: "",
    },
    licenceCar_front: {
      type: String,
    },
    licenceCar_back: {
      type: String,
    },
    licenceCar_expiration: {
      type: String,
      default: "",
    },
    drugAnalysis: {
      type: String,
    },
    inOrder: {
      type: Boolean,
      default: false,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShippingCompany",
    },
    status: {
      // when he is created his company should approve him
      type: String,
      enum: ["Pending", "Confirmed", "Blocked"],
      default: "Pending",
    },
    // عشان البند بتاع استعراض الاكثر تنفيذا للطلبات
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
    location: {
      longitude: {
        type: String,
      },
      latitude: {
        type: String,
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Delivery", DeliverySchema);
