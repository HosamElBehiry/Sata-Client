const { dE } = require("../../shared/shared");
const Delivery = require("../../models/Delivery");
const delivFindCont = require("./find");

// هنا دى تكمله بيانات تعديل الديلفرى بواسطه الادمن
const updateByUsrId = async (req, res) => {
  try {
    // انا هنا عملت الشرط ده عشان حوار فك الحظر اللى قال عليه
    if (req.body.licence_front !== "undefined") {
      const updDelivData = await Delivery.updateOne(
        { user: req.params.id },
        {
          $set: {
            licence_front: req.files.licence_front
              ? req.files.licence_front[0].path
              : req.body.licence_front,
            licence_back: req.files.licence_back
              ? req.files.licence_back[0].path
              : req.body.licence_back,
            licence_expiration: new Date(req.body.licence_expiration),
            licenceCar_front: req.files.licenceCar_front
              ? req.files.licenceCar_front[0].path
              : req.body.licenceCar_front,
            licenceCar_back: req.files.licenceCar_back
              ? req.files.licenceCar_back[0].path
              : req.body.licenceCar_back,
            licenceCar_expiration: new Date(req.body.licenceCar_expiration),
            drugAnalysis: req.files.drugAnalysis
              ? req.files.drugAnalysis[0].path
              : req.body.drugAnalysis,
            company: req.body.company,
            isDeleted: req.body.isDeleted,
          },
        }
      );
    }
    delivFindCont.findByUsrId(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// لما مستخدم يديله تقييم يروح يتضاف فى الجدول بتاع الديلفرى
const updateRate = async (req, res) => {
  try {
    const delivUsr = await Delivery.findById(req.body.delivery);
    const upd = await Delivery.findByIdAndUpdate(delivUsr._id.toString(), {
      $push: { "rate.all": req.body.rate },
      $set: {
        "rate.value":
          delivUsr.rate.all.length > 0
            ? (delivUsr.rate.all.reduce((prev, curr) => prev + curr) +
                req.body.rate) /
              (delivUsr.rate.all.length + 1)
            : req.body.rate,
      },
    });
    req.reciever = delivUsr.user;
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// soft delete when deleting user
const deleteByUsrId = async (req, res) => {
  try {
    const delivUpd = await Delivery.findOneAndUpdate(
      { user: req.params.id },
      { $set: { isDeleted: true } }
    );
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// soft delete for multi delivery
const deleteMany = async (req, res) => {
  try {
    const delivUpd = await Delivery.updateMany(
      { user: { $in: req.body } },
      { $set: { isDeleted: true } }
    );
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { updateByUsrId, deleteByUsrId, updateRate, deleteMany };
