const WishList = require("../../models/WishList");
const { dE, dSuc } = require("../../shared/shared");

const findById = async (req, res) => {
  try {
    const wishList = await WishList.findById(
      req.isAdded ? req.isAdded._id : req.params.id
    );
    dSuc(res, wishList);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// بتجيب كل الويش ليستس اللى فى الموقع
const findAll = async (req, res) => {
  try {
    const all = await WishList.find();
    dSuc(res, all);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// بتجيب الويش ليستس بتوع يوزر معين
const findByUsr = async (req, res) => {
  try {
    const usrLists = await WishList.find({ user: req.user._id })
      .populate("product", "title image store price")
      .select("-user");
    dSuc(res, usrLists);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// بتشوف اذا كان المنتج موجود فى الويش لبست بتاعت اليوزر ولا لا
// مستخدمها فى الموبايل
const checkProdWishList = async (req, res) => {
  try {
    const checked = await WishList.find({
      user: req.user._id,
      product: req.body.product,
    });
    dSuc(res, checked.length === 0 ? false : true);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { findById, findAll, findByUsr, checkProdWishList };
