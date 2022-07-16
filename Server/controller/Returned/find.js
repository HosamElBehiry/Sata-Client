const ReturnedProducts = require("../../models/ReturnedProducts");
const { dE, dSuc } = require("../../shared/shared");

const ordItmObj = {
  path: "ordItm",
  populate: {
    path: "product",
    populate: {
      path: "user",
      select: "_id fullname",
    },
    select: "user",
  },
  select: "product",
};

const findById = async (req, res) => {
  try {
    const retId = await ReturnedProducts.findById(
      req.newRetProd ? req.newRetProd._id : req.params.id
    );
    if (req.isDeleted) {
      return retId;
    } else {
      dSuc(res, retId);
    }
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// بتجيب كل المنتجات المرتجعه
const findAll = async (req, res) => {
  try {
    const allRet = await ReturnedProducts.find({ isDeleted: false }).populate(
      ordItmObj
    );
    dSuc(res, allRet);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// بتجيب كل المنتجات المرتجعه الخاصه ببائع معين
const findVendRet = async (req, res) => {
  try {
    const result = [];
    const allRet = await ReturnedProducts.find({ isDeleted: false }).populate(
      ordItmObj
    );
    for (let i = 0; i < allRet.length; i++) {
      if (allRet[i].ordItm.product.user._id.toString() === req.user._id) {
        result.push(allRet[i]);
      }
    }
    dSuc(res, result);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { findById, findAll, findVendRet };
