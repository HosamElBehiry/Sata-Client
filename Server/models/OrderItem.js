const mongoose = require("mongoose");

const OrderItemSchema = mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    },
    quantity: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Confirmed", "onDelivery", "Deliverd", "Refused"],
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    delivery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Delivery",
    },
    size: {
      type: [String],
      default: "",
    },
    color: {
      type: [String],
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderItem", OrderItemSchema);
