const Cart = require("../../models/Cart");
const Products = require("../../models/Products");
const cartFindCont = require("./find");
const { dE, dSuc } = require("../../shared/shared");

const updateCart = async (req, res) => {
  try {
    const prodData = await Products.findById(req.body.items[0].product);
    const prodInCart = await Cart.findOne({
      user: req.user._id,
      "items.product": req.body.items[0].product,
    });
    if (!prodInCart) {
      const updCart = await Cart.updateOne(
        { user: req.user._id },
        {
          $push: { items: req.body.items[0] },
          $inc: { total: prodData.price * req.body.items[0].quantity },
        }
      );
      cartFindCont.findById(req, res);
    } else {
      const totalPrice = prodInCart.items
        .filter((item) => {
          return item.product.toString() !== req.body.items[0].product;
        })
        .reduce((prev, curr) => prev + curr.price * curr.quantity, 0);
      const updCart = await Cart.updateOne(
        {
          user: req.user._id,
          "items.product": req.body.items[0].product,
        },
        {
          $set: {
            "items.$": req.body.items[0],
            total:
              totalPrice + req.body.items[0].price * req.body.items[0].quantity,
          },
        }
      );
      cartFindCont.findById(req, res);
    }
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// دى عشان يقدر يعدل عدد المنتجات فى العربه بتاعته
const usrUpdCart = async (req, res) => {
  try {
    const newCart = await Cart.updateOne(
      { user: req.user._id },
      {
        $set: {
          items: req.body.items,
          total: req.body.total,
        },
      }
    );
    dSuc(res, req.t("DISPLAY.SUCCESS"));
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// ده عشان الموبايل يقدر يعمل تعديل للعربه
const updateForMobile = async (req, res) => {
  try {
    const updCart = await Cart.updateOne(
      { user: req.user._id, "items.product": req.body.items[0].product },
      {
        $set: {
          "items.$": req.body.items[0],
          total: req.body.total,
        },
      }
    );
    dSuc(res, req.t("DISPLAY.SUCCESS"));
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { updateCart, usrUpdCart, updateForMobile };
