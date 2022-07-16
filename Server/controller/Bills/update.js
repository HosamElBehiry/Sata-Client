const Bill = require("../../models/Bill");
const billFndCont = require("./find");
const { dE, dNotPermit, dSuc } = require("../../shared/shared");

const updateById = async (req, res) => {
  try {
    let flag = true;
    const billInfo = await Bill.findById(req.params.id);
    if (
      req.user.roles[0] === 2 &&
      billInfo.vendor.toString() !== req.user._id.toString()
    ) {
      flag = !flag;
      dNotPermit(res, req.t("NOT.PERMITTED"));
    } else {
      const updBillInfo = await Bill.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      billFndCont.findById(req, res);
    }
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// دى من خلالها بيتم تعديل حالات الاستلام من ساتا لكذا فاتوره
const updateBills = async (req, res) => {
  try {
    const updBills = await Bill.updateMany(
      { _id: { $in: req.body } },
      {
        $set: {
          deliverdToSata: true,
          acceptedBySata: true,
        },
      }
    );
    dSuc(res, req.t("UPDATE.MANY.BILLS"));
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { updateById, updateBills };
