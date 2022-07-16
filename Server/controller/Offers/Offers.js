const Offers = require("../../models/Offers");
const { dE } = require("../../shared/shared");

const getOffersRelatedToVendor = async (req, res) => {
  try {
    const vendorOffers = await Offers.find({ _id: { $in: req.user.Offers } });
    res.status(200).json(vendorOffers);
  } catch (error) {
    dE(res, error);
  }
};

module.exports = { getOffersRelatedToVendor };
