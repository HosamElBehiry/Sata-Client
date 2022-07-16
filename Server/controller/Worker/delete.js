const Users = require("../../models/Users");
const Worker = require("../../models/Worker");
const { dE, dSuc } = require("../../shared/shared");

const deleteByUsrId = async (req, res) => {
  try {
    await Worker.findOneAndUpdate(
      { user: req.params.id },
      { $set: { isDeleted: true } }
    );
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// soft delete for multi worker ..
const deleteMany = async (req, res) => {
  try {
    await Worker.updateMany(
      { user: { $in: req.body } },
      { $set: { isDeleted: true } }
    );
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// عشان لما البائع يشيل العامل
// مستخدمها فى الموبايل
// مستخدمها فى الادمن بانيل عشان لما البائع يمسح بيانات عامل واحد خاص بيه

const deleteById = async (req, res) => {
  try {
    const delWorker = await Worker.findByIdAndUpdate(req.params.id, {
      $set: { isDeleted: true },
    });
    const delWorkUsr = await Users.findByIdAndUpdate(req.body.user, {
      $set: { isDeleted: true },
    });
    dSuc(res, req.t("DISPLAY.SUCCESS"));
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// مستخدمها فى الادمن بانل عشان لما البائع يعوزر يعمل ديليت لكذا عامل خاص بيه
const deleteByVendor = async (req, res) => {
  try {
    await deleteMany(req, res);
    const dltUsers = await Users.updateMany(
      { _id: { $in: req.body } },
      { $set: { isDeleted: true } }
    );
    dSuc(res, req.t("DISPLAY.SUCCESS"));
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { deleteByUsrId, deleteMany, deleteById, deleteByVendor };
