const mongoose = require("mongoose");

const OfferSchema = mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,
    },
    from: {
      type: Date,
    },
    to: {
      type: Date,
    },
    quantity: {
      type: Number,
    },
    products: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Products",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offers", OfferSchema);
