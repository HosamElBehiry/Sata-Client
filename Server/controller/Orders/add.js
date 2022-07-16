const Orders = require("../../models/Orders");
const ordItmAdd = require("./orderItems");
const { dE } = require("../../shared/shared");
const Users = require("../../models/Users");

const addOrder = async (req, res) => {
  try {
    req.newOrder = await new Orders({
      price: req.body.price,
      shipping_cost: req.body.shipping_cost,
      phone: req.body.phone ? req.body.phone : req.user.phone,
      address: req.body.address,
      longitude: req.body.longitude,
      latitude: req.body.latitude,
      fullname: req.body.fullname ? req.body.fullname : req.user.fullname,
      customer: req.user._id,
      "payment_type.with_money": req.body.paymentType === "money",
      "payment_type.with_bocket": req.body.paymentType === "bocket",
    }).save();
    // ضيف الاى دى ضمن جدول المستخدم اللى عمل الطلب
    await Users.findByIdAndUpdate(req.user._id, {
      $push: { Orders: req.newOrder._id },
    });
    ordItmAdd.addNew(req, res);
  } catch (error) {
    dE(res, error);
  }
};

module.exports = { addOrder };
