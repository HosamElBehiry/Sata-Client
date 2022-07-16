const mongoose = require("mongoose");
const Bill = require("../../models/Bill");
const { dE, dSuc } = require("../../shared/shared");

var ordItmObj = {
  path: "ordItm",
  populate: {
    path: "product",
    select: "title price image",
  },
  select: "product quantity",
};

const findBetween = async (req, res) => {
  try {
    const filtBill = await Bill.find({
      createdAt: {
        $gte: new Date(req.params.start),
        $lte: new Date(req.params.end),
      },
    })
      .populate("order", "payment_type")
      .populate(ordItmObj)
      .populate("vendor", "fullname email image");
    let sum = 0;
    filtBill.forEach((bill) => {
      sum += bill.money;
    });
    dSuc(res, { Bills: filtBill, Total: sum });
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

const findById = async (req, res) => {
  try {
    const billInfo = await Bill.findById(req.params.id)
      .populate("order", "payment_type")
      .populate(ordItmObj)
      .populate("vendor", "fullname email image");
    dSuc(res, billInfo);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

const findSataProfits = async (req, res) => {
  try {
    const profits = await Bill.aggregate([
      {
        $match: {
          deliverdToSata: true,
          acceptedBySata: true,
        },
      },
      {
        $lookup: {
          from: "vendors",
          localField: "vendor",
          foreignField: "user",
          as: "vendorData",
        },
      },
      {
        $project: {
          money: 1,
          "vendorData.app_balance_amount": 1,
          "vendorData.app_balance_type": 1,
        },
      },
    ]);
    let sum = 0;
    profits.forEach((profit) => {
      if (profit.vendorData[0].app_balance_type === "percentage") {
        sum += (profit.vendorData[0].app_balance_amount * profit.money) / 100.0;
      } else {
        sum += profit.vendorData[0].app_balance_amount;
      }
    });
    dSuc(res, sum);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// بتجيب الفلوس اللى كسبها بائع معين وبديها الاى دى بتاعه فى جدول اليوزرات
const vendorProfits = async (req, res) => {
  try {
    const vendorProfit = await Bill.aggregate([
      {
        $match: {
          vendor: mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$money" },
        },
      },
    ]);
    dSuc(res, vendorProfit);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { findBetween, findById, findSataProfits, vendorProfits };
