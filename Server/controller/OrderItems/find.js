const moment = require("moment");
const OrderItem = require("../../models/OrderItem");
const { dE, dSuc } = require("../../shared/shared");

const findAllByDays = async (req, res) => {
  try {
    const ordItm = await OrderItem.find()
      .select("product quantity status createdAt")
      .populate("product", "price title");
    const result = [];
    ordItm.map((o) => {
      let a = moment(new Date(o.createdAt), "D/M/YYYY");
      let b = moment(new Date(), "D/M/YYYY");
      if (moment(b).diff(a, "days") <= req.params.days) result.push(o);
    });
    dSuc(res, result);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// عشان اجيب اجمالى المبيعات تبع النظام المالى
const findDeliverd = async (req, res) => {
  try {
    const delivOrd = await OrderItem.find({ status: `Deliverd` })
      .select("product quantity")
      .populate("product", "price");
    let sum = 0;
    delivOrd.forEach((elem) => {
      sum += elem.product.price * elem.quantity;
    });
    dSuc(res, sum);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// مستخدمها لما بدوس على العين فى حدول الاوردرات فى الادمن
const findbyOrdId = async (req, res) => {
  try {
    const ordItm = await OrderItem.find({ order: req.params.id })
      .populate("product", "title price image")
      .populate("customer", "fullname");
    dSuc(res, ordItm);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { findAllByDays, findDeliverd, findbyOrdId };
