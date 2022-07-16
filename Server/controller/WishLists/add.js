const WishList = require("../../models/WishList");
const findWishCont = require("./find");
const { dE, dNotPermit } = require("../../shared/shared");

const addNew = async (req, res) => {
  try {
    const ProdWishLists = await WishList.find({ product: req.body.product });
    const users = ProdWishLists.map((p) => p.user.toString());
    if (users.indexOf(req.user._id) !== -1) {
      dNotPermit(res, req.t("NOT.PERMITTED"));
    } else {
      const newWishList = await new WishList({
        product: req.body.product,
        user: req.user._id,
      }).save();
      req.isAdded = newWishList;
      findWishCont.findById(req, res);
    }
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { addNew };
