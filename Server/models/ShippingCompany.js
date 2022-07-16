const mongoose = require("mongoose");
const ShippingCompanySchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  telephone: {
    type: String,
  },
  mobile: {
    type: String,
  },
  logo: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Blocked"],
    default: "Pending",
  },
  Notification: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Notification",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("ShippingCompany", ShippingCompanySchema);
