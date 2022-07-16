const Offers = require("../../models/Offers");
const { dE } = require("../../shared/shared");

// بتجيب كل العروض وبديها الاى دى بتاعت المنتج
const getOfferByProdId = async (req, res) => {
  try {
    return await (
      await Offers.find({ Products: { $in: req.params.id } })
    ).filter((offer) => offer.isDeleted === false);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { getOfferByProdId };
