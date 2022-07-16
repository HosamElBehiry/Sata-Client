const mongoose = require("mongoose");

const ShipppingAddressSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    longitude: {
      type: String,
      default: "",
    },
    latitude: {
      type: String,
      default: "",
    },
    address:{
        type:String,
        default:""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShippingAddress", ShipppingAddressSchema);
