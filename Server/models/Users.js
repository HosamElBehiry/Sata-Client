const mongoose = require("mongoose");
const UserShema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    telephone: {
      type: String,
      default: "",
    },
    mobile: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "vendor", "worker", "delivery"],
    },
    image: {
      type: String,
      default: "",
    },
    online: {
      type: Boolean,
      default: false,
    },
    loggedAt: {
      type: Date,
      default: Date.now(),
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Blocked"],
      default: "Confirmed",
    },
    Notifications: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Notification",
    },
    Offers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Offers",
    },
    Orders: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Order",
    },
    Products: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Products",
    },
    numberOfOrders: {
      // عشان البند بتاع الاكثر طلبا
      type: Number,
      default: 0,
    },
    rating: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserShema);
