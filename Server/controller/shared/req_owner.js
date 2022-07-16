const vendUpdCont = require("../Vendor/update");
const prodUpdCont = require("../Products/update");
const findOrdCont = require("../Orders/find");
const findOrdItmCont = require("../OrderItems/find");
const returnProdCont = require("../Returned/find");
const findVendOrdItmCont = require("../Vendor/OrderItems/find");
const delWorkCont = require("../Worker/delete");
const { dE, dSuc, dNotPermit } = require("../../shared/shared");
const Vendor = require("../../models/Vendor");

// دى بتقولى مين بالظبط الى عامل ال الريكويست
// لحد دلوقتى انا مستخدمها فى تعديل المنتج ما بين الادمن والبائع فقط
const detOwner = async (req, res) => {
  try {
    if (req.user.roles[0] === 1) {
      prodUpdCont.updateById(req, res);
    } else if (req.user.roles[0] === 2) {
      vendUpdCont.updateProduct(req, res);
    }
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// تشوف مين اللى داخل وتجيب الاوردر اتيمز بتاعته
const ordItemOwner = async (req, res) => {
  try {
    if (req.user.roles[0] === 1) {
      findOrdItmCont.findAllByDays(req, res);
    } else {
      findVendOrdItmCont.findOrdItm(req, res);
    }
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// تحدد مين اللى داخل عشان يشوف الطلب وبناء عليه يجيبله الطلبات ديه
const ordOwner = async (req, res) => {
  try {
    if (req.user.roles[0] === 1) {
      findOrdCont.findByType(req, res);
    } else {
      dSuc(res, "Not Yet !");
    }
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// بتحدد مين اللى داخل علشان يجيب المنتجات اللى رجعت من مستخدمين
const retPrdOwner = async (req, res) => {
  try {
    if (req.user.roles[0] === 1) {
      returnProdCont.findAll(req, res);
    } else {
      returnProdCont.findVendRet(req, res);
    }
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// بتعمل للعامل سوفت ديليت
const workerOwner = async (req, res) => {
  try {
    if (req.user.roles[0] === 2) {
      const vendorData = await Vendor.findOne({ user: req.user._id });
      if (vendorData.workers.indexOf(req.params.id) !== -1) {
        delWorkCont.deleteById(req, res);
      } else {
        dNotPermit(res, req.t("NOT.PERMITTED"));
      }
    } else {
      req.isAdmin = true;
      delWorkCont.deleteById(req, res);
    }
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { detOwner, ordItemOwner, ordOwner, retPrdOwner, workerOwner };
