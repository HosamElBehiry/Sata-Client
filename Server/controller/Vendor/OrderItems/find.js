const OrderItem = require("../../../models/OrderItem");
const Users = require("../../../models/Users");
const moment = require("moment");
const { dE, dSuc } = require("../../../shared/shared");

const findOrdItm = async (req, res) => {
  try {
    const vendData = await Users.findById(req.user._id);
    const ordItm = await OrderItem.find({
      product: { $in: vendData.Products },
    })
      .select("product quantity status createdAt")
      .populate("product", "price title");
    const result = [];
    ordItm.map((o) => {
      let a = moment(new Date(o.createdAt), "D/M/YYYY");
      let b = moment(new Date(), "D/M/YYYY");
      if (moment(b).diff(a, "days") <= req.params.days) result.push(o);
    });
    dSuc(res, result);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { findOrdItm };
