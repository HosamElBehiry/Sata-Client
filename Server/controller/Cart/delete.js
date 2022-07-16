const Cart = require("../../models/Cart");
const Products = require("../../models/Products");
const { dE, dSuc } = require("../../shared/shared");

const deleteFromCart = async (req, res) => {
  try {
    const prodData = await Products.findById(req.body.items[0].product);
    const dltCart = await Cart.updateOne(
      { user: req.user._id },
      {
        $pull: { items: req.body.items[0] },
        $inc: { total: -1 * prodData.price * req.body.items[0].quantity },
      }
    );
    dSuc(res, req.t("DISPLAY.SUCCESS"));
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// بتشيل كل اللى فى العربه
// عشان لما يعمل الاوردر يشيل كل اللى فى العربه
// مستخدمه للموبايل لحد دلوقتى
const deleteCart = async (req, res) => {
  try {
    const delCart = await Cart.deleteOne({ user: req.user._id });
    dSuc(res, req.t("DISPLAY.SUCCESS"));
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { deleteFromCart, deleteCart };
