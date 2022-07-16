const Vendor = require("../../models/Vendor");
const prodFindCont = require("../Products/find");
const { dE, dSuc } = require("../../shared/shared");
const mongoose = require("mongoose");

var workerObj = {
  path: "workers",
  populate: {
    path: "user",
    select: "fullname image",
  },
  select: "user _id ",
};
var userObj = {
  path: "user",
  populate: {
    path: "Products",
    populate: [
      {
        path: "categoryId",
        select: "title",
      },
      {
        path: "subCategory",
        select: "title",
      },
      {
        path: "brand",
        select: "title",
      },
    ],
    select:
      "title _id image createdAt categoryId subCategory brand rate isApproved",
  },
  select: "fullname email image ",
};

const findvendInfo = async (req, res) => {
  try {
    const vendData = await Vendor.findOne({ user: req.user._id })
      .populate(userObj)
      .populate(workerObj)
      .populate("Profits");
    if (req.VendReports) {
      req.allReports = [{ vendData: vendData }];
      prodFindCont.mostVisited(req, res);
    } else {
      dSuc(res, vendData);
    }
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

const getVendReports = async (req, res) => {
  try {
    req.VendReports = true;
    findvendInfo(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

const findByUserId = async (req, res) => {
  try {
    const vend = await Vendor.findOne({ user: req.params.id })
      .populate(
        "user",
        "fullname telephone mobile email image status isDeleted"
      )
      .select(
        "taxcard_front taxcard_back taxcard_expiration commercialRecord createdAt " +
          "commericalRecord_expiration app_balance_type app_balance_amount"
      );
    dSuc(res, vend);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// دى بتحيب الناس اللى معمولها حظر ومسجلين بناء على الايام و الناس اللى مسجلتش وكل حاجه بس شغاله للبائعين
const vendorInfo = async (req, res) => {
  try {
    const usrsId = req.info.map((u) => u._id);
    const vendors = await Vendor.find({ user: { $in: usrsId } })
      .select("rate user createdAt ")
      .populate("user", "image fullname email status");
    dSuc(res, vendors);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// دى تبع الاى بى اى بتاعت البروفايل بتاعت بائع معين
const vendorProfile = async (req, res) => {
  try {
    let vendData = await Vendor.findOne({ user: req.params.id })
      .populate(userObj)
      .populate(workerObj)
      .select("workers user app_balance_amount app_balance_type rate Net");
    dSuc(res, vendData);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// بتجيب  مجموع عموله ساتا من كل البائعين
const getProfitCommissions = async (req, res) => {
  try {
    const allVendors = await Vendor.find(
      {},
      {
        Profits: 1,
        app_balance_type: 1,
        app_balance_amount: 1,
      }
    ).populate("Profits");
    let vendorsProfits = 0;
    let sataProfits = 0;
    allVendors.forEach((vend) => {
      vend.Profits.forEach((profit) => {
        vendorsProfits +=
          profit.money - (profit.money * vend.app_balance_amount) / 100.0;
        if (vend.app_balance_type === "percentage") {
          sataProfits += (profit.money * vend.app_balance_amount) / 100.0;
        }
      });
    });
    dSuc(res, { vendorsProfits, sataProfits });
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = {
  findvendInfo,
  getVendReports,
  findByUserId,
  vendorInfo,
  vendorProfile,
  getProfitCommissions,
};
