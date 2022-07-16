const Vendor = require("../../models/Vendor");
const Worker = require("../../models/Worker");
const { dE, dSuc } = require("../../shared/shared");

var userObj = {
  path: "vendor",
  populate: {
    path: "user",
    select: "fullname email image ",
  },
  select: "user",
};

const findByUsrId = async (req, res) => {
  try {
    const workerData = await Worker.findOne({ user: req.params.id })
      .populate(
        "user",
        "image fullname email telephone mobile status isDeleted"
      )
      .populate(userObj)
      .select("-isDeleted -__v");
    dSuc(res, workerData);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// انا هنا جايب معلومات البائع عشان ممكن البائع هو بنفسه يخش يشوف العمال بتوعه فى الادمن بانل
const findAll = async (req, res) => {
  try {
    const vendorData = await Vendor.findOne({ user: req.user._id });
    const allWorkers = await Worker.find(
      req.user.roles[0] === 1
        ? {
            isDeleted: req.query.isDeleted ? true : false,
          }
        : {
            isDeleted: req.query.isDeleted ? true : false,
            vendor: vendorData._id.toString(),
          }
    )
      .populate(
        "user",
        "fullname email image status telephone mobile createdAt"
      )
      .populate(userObj)
      .select(" canAdd canUpdate canDelete");
    dSuc(res, allWorkers);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// دى بتحيب الناس اللى معمولها حظر ومسجلين بناء على الايام و الناس اللى مسجلتش وكل حاجه بس شغاله لعمال المخازن
const workerInfo = async (req, res) => {
  try {
    const usrsId = req.info.map((u) => u._id);
    const workers = await Worker.find({ user: { $in: usrsId } })
      .populate("user", "fullname email image status createdAt")
      .populate(userObj)
      .select("-isDeleted -__v -canAdd -canUpdate -canDelete");
    dSuc(res, workers);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { findByUsrId, findAll, workerInfo };
