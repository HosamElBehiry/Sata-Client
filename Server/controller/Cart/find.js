const Cart = require("../../models/Cart");
const { dE, dSuc } = require("../../shared/shared");

const findById = async (req, res) => {
  try {
    // اول واحده ديه بتاعت لما ميكونش اصلا عنده اى حاجه فى عربه التسوق
    // تانى واحده لو عنده عربه تسوف بالفعل وضاف على اللى عنده منتج
    // تالت واحده دى لو عايز اعمل سيرش بالاى دى
    const cartData = await Cart.findById(
      req.newCart
        ? req.newCart._id
        : req.cartData
        ? req.cartData._id
        : req.params.id
    ).populate("user", "fullname");
    dSuc(res, cartData);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// الهدف منها ان لما يوزر يعمل لوج ان فى السايت يعرض له العربه يتاعته فيها ايه
const findByUsrId = async (req, res) => {
  try {
    const cartData = await Cart.findOne({ user: req.user._id })
      .populate("items.product", "image title")
      .select("-user -__v");
    dSuc(res, cartData);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// الهدف منها انى اجيب المنتحات اللى جوه العربه عشان فى الديزاين لو موجود المنتج
// ده اخلى الزرار بتاع الاضافه يقلب احمر واعمل شويه حركات
const getProdCart = async (req, res) => {
  try {
    const prodCart = await Cart.findOne({ user: req.user._id }).select(
      "items.product -_id"
    );
    dSuc(res, prodCart);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { findById, findByUsrId, getProdCart };
