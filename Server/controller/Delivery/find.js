const Delivery = require("../../models/Delivery");
const { dE, dSuc } = require("../../shared/shared");

const findAll = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ isDeleted: req.query.isDeleted })
      .populate("user", "fullname email status image ")
      .select("rate createdAt inOrder");
    dSuc(res, deliveries);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

const findByUsrId = async (req, res) => {
  try {
    const delivData = await Delivery.findOne({ user: req.params.id })
      .populate(
        "user",
        "fullname telephone mobile email image status isDeleted"
      )
      .populate("company", "name")
      .select(
        "licence_front licence_back licenceCar_front licenceCar_back createdAt " +
          "drugAnalysis licence_expiration licenceCar_expiration"
      );
    dSuc(res, delivData);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// دى بتحيب الناس اللى معمولها حظر ومسجلين بناء على الايام و الناس اللى مسجلتش وكل حاجه بس شغاله لعمال التوصيل
const deliveryInfo = async (req, res) => {
  try {
    const usrsId = req.info.map((u) => u._id);
    const deliveries = await Delivery.find({ user: { $in: usrsId } })
      .select("rate user createdAt inOrder ")
      .populate("user", "image fullname email status");
    dSuc(res, deliveries);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { findAll, findByUsrId, deliveryInfo };
