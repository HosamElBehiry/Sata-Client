const Cart = require("../../models/Cart");
const Products = require("../../models/Products");
const cartFindCont = require("./find");
const cartUpdtCont = require("./update");
const { dE } = require("../../shared/shared");

const checkCart = async (req, res) => {
  try {
    const cartData = await Cart.findOne({ user: req.user._id });
    if (cartData) {
      req.cartData = cartData;
      cartUpdtCont.updateCart(req, res);
    } else {
      addNew(req, res);
    }
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

const addNew = async (req, res) => {
  try {
    const prodData = await Products.findById(req.body.items[0].product);
    req.newCart = await new Cart({
      user: req.user._id,
      items: req.body.items,
      total: prodData.price * req.body.items[0].quantity,
    }).save();
    cartFindCont.findById(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { checkCart };
