const WishList = require("../../models/WishList");
const { dE, dSuc, dNotPermit } = require("../../shared/shared");

const deleteById = async (req, res) => {
  try {
    const wishInfo = await WishList.findById(req.params.id);
    if (wishInfo.user.toString() !== req.user._id.toString()) {
      dNotPermit(res, req.t("NOT.PERMITTED"));
    } else {
      const delWish = await WishList.findByIdAndDelete(req.params.id);
      dSuc(res, req.t("DELETED.SUCCESSFULLY"));
    }
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { deleteById };
