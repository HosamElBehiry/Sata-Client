const Worker = require("../../models/Worker");
const workFindCont = require("./find");
const Vendor = require("../../models/Vendor");
const { dE, dSuc } = require("../../shared/shared");

const updateByUsrId = async (req, res) => {
  try {
    // انا هنا عامل الشرط ده عشان حوار فك الحظر اللى قال عليه
    if (req.body.vendor !== "undefined") {
      const vendUser = await Vendor.findOne({ user: req.body.vendor });
      const updWorkerData = await Worker.findOneAndUpdate(
        { user: req.params.id },
        {
          $set: {
            vendor: vendUser._id.toString(),
            canAdd: req.body.canAdd,
            canUpdate: req.body.canUpdate,
            canDelete: req.body.canDelete,
            isDeleted: req.body.isDeleted,
          },
        }
      );
    }
    workFindCont.findByUsrId(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// مستخدمها فى الموبايل لما البائع يعور انه يعدل بيانات العامل
// كمان مستخدمها فى الادمن بانل لما البائع يعوز يعدل بيانات عامل معين
const updateByVendor = async (req, res) => {
  try {
    const updWorker = await Worker.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    dSuc(res, req.t("DISPLAY.SUCCESS"));
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { updateByUsrId, updateByVendor };
