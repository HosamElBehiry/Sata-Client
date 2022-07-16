const Users = require("../../models/Users");
const prodUpdCont = require("../Products/update");
const vendFindCont = require("./find");
const Vendor = require("../../models/Vendor");
const { dE, dNotPermit } = require("../../shared/shared");

// هنا الادمن هيحاول انه يغير معلومات البائع
const updateByAdmin = async (req, res) => {
  try {
    // انا عملت الشرط ده عشان الحته بتاعت فك الحظر اللى قال عليه
    if (req.body.taxcard_expiration !== "undefined") {
      const updVendData = await Vendor.findOneAndUpdate(
        { user: req.params.id },
        {
          $set: {
            taxcard_expiration: new Date(req.body.taxcard_expiration),
            commericalRecord_expiration: new Date(
              req.body.commericalRecord_expiration
            ),
            isDeleted: req.body.isDeleted,
            app_balance_type: req.body.app_balance_type,
            app_balance_amount: req.body.app_balance_amount,
            taxcard_front: req.files.taxcard_front
              ? req.files.taxcard_front[0].path
              : req.body.taxcard_front,
            taxcard_back: req.files.taxcard_back
              ? req.files.taxcard_back[0].path
              : req.body.taxcard_back,
            commercialRecord: req.files.commercialRecord
              ? req.files.commercialRecord[0].path
              : req.body.commercialRecord,
          },
        }
      );
    }
    vendFindCont.findByUserId(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// اتاكد الاول ان المنتج بتاعه وبعدين اخليه يعمل تعديل
const updateProduct = async (req, res) => {
  try {
    const userInfo = await Users.findOne({ Products: req.params.id });
    if (
      userInfo === null ||
      req.user._id.toString() !== userInfo._id.toString()
    ) {
      dNotPermit(res, req.t("NOT.PERMITTED"));
    } else {
      prodUpdCont.updateById(req, res);
    }
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// لما مستخدم يديله تقييم يروح يتضاف فى الجدول بتاع البائع
const updateRate = async (req, res) => {
  try {
    const vendUsr = await Vendor.findById(req.body.vendor);
    const upd = await Vendor.findByIdAndUpdate(vendUsr._id.toString(), {
      $push: { "rate.all": req.body.rate },
      $set: {
        "rate.value":
          vendUsr.rate.all.length > 0
            ? (vendUsr.rate.all.reduce((prev, curr) => prev + curr) +
                req.body.rate) /
              (vendUsr.rate.all.length + 1)
            : req.body.rate,
      },
    });
    req.reciever = vendUsr.user;
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { updateProduct, updateByAdmin, updateRate };
