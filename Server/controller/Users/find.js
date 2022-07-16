const moment = require("moment");
const Users = require("../../models/Users");
const vendFndCont = require("../Vendor/find");
const delvFndCont = require("../Delivery/find");
const workFndCont = require("../Worker/find");
const { dE, dSuc } = require("../../shared/shared");

const findById = async (req, res) => {
  try {
    const userData = await Users.findById(req.params.id)
      .select(
        "image fullname createdAt email status Notifications mobile telephone status isDeleted"
      )
      .populate("Notifications", "description createdAt");
    dSuc(res, userData);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

const getNews = async (req, res) => {
  try {
    const data = await Users.find({
      role: req.params.role,
      isDeleted: false,
    }).select("image fullname createdAt email status");
    const ids = [];
    data.map(
      (u) =>
        (new Date() - u.createdAt) / (1000 * 60 * 60 * 24) <
          parseInt(req.params.days) && ids.push(u)
    );
    if (req.params.role === "user") {
      dSuc(res, ids);
    } else if (req.params.role === "vendor") {
      req.info = ids;
      vendFndCont.vendorInfo(req, res);
    } else if (req.params.role === "delivery") {
      req.info = ids;
      delvFndCont.deliveryInfo(req, res);
    } else if (req.params.role === "worker") {
      req.info = ids;
      workFndCont.workerInfo(req, res);
    }
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

const notSignedByDays = async (req, res) => {
  try {
    const notLoggedAt = await Users.find({
      online: false,
      role: req.params.role,
      isDeleted: false,
    }).select("image fullname createdAt email status");
    const ids = [];
    notLoggedAt.map(
      (u) =>
        !(
          moment(new Date(), "D/M/YYYY").diff(moment(u.loggedAt), "days") <
          parseInt(req.params.days)
        ) && ids.push(u)
    );
    if (req.params.role === "user") {
      dSuc(res, ids);
    } else if (req.params.role === "vendor") {
      req.info = ids;
      vendFndCont.vendorInfo(req, res);
    } else if (req.params.role === "delivery") {
      req.info = ids;
      delvFndCont.deliveryInfo(req, res);
    } else if (req.params.role === "worker") {
      req.info = ids;
      workFndCont.workerInfo(req, res);
    }
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

const findBlocked = async (req, res) => {
  try {
    const blocked = await Users.find({
      status: "Blocked",
      role: req.params.role,
      isDeleted: false,
    }).select("image fullname createdAt email status");
    if (req.params.role === "user") {
      dSuc(res, blocked);
    } else if (req.params.role === "vendor") {
      req.info = blocked;
      vendFndCont.vendorInfo(req, res);
    } else if (req.params.role === "delivery") {
      req.info = blocked;
      delvFndCont.deliveryInfo(req, res);
    } else if (req.params.role === "worker") {
      req.info = blocked;
      workFndCont.workerInfo(req, res);
    }
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// لغايه دلوقتى انا مستخدمها فقط فى السكشن بتاع ارسال الاشعارات
const findAll = async (req, res) => {
  try {
    const all = await Users.find({ isDeleted: false }).select("fullname email");
    dSuc(res, all);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { findById, getNews, notSignedByDays, findBlocked, findAll };
