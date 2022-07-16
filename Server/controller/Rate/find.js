const Rating = require("../../models/Rating");
const rateConstants = require("./constants");
const { dE, dSuc, dNotPermit } = require("../../shared/shared");

// دى يشوفها الادمن بس عشان فى حاجات لسه بيندنج
const findAll = async (req, res) => {
  try {
    const allRates = await Rating.find()
      .populate("product", "title image price")
      .populate(rateConstants.vendorObj)
      .populate(rateConstants.delivObj)
      .populate("user", "fullname image");
    dSuc(res, allRates);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// دى يشوفها كل الناس عشان الادمن وافق عليها
const findByType = async (req, res) => {
  try {
    if (req.params.type !== "Confirmed") {
      dNotPermit(res, req.t("NOT.PERMITTED"));
    } else {
      const filtRating = await Rating.find({ status: req.params.type });
      dSuc(res, filtRating);
    }
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

const findByRateType = async (req, res) => {
  try {
    const rateTypes = await Rating.find()
      .populate("product", "title image price")
      .populate(rateConstants.vendorObj)
      .populate(rateConstants.delivObj)
      .populate("user", "fullname image email");
    const filterRates = rateTypes.filter(
      (r) => r[req.params.type] !== undefined
    );
    dSuc(res, filterRates);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

const findById = async (req, res) => {
  try {
    const rateDate = await Rating.findById(req.params.id);
    dSuc(res, rateDate);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// دى الهدف منها انى بديها الاى دى بتاع المنتج تجيب كل التعليقات
// على المنتج ده اللى اتوافق عليها من الادمن
const findByProdId = async (req, res) => {
  try {
    const prodInfo = await Rating.find({
      product: req.params.id,
    }).populate("user", "fullname image");
    dSuc(res, prodInfo);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = {
  findAll,
  findByType,
  findById,
  findByRateType,
  findByProdId,
};
