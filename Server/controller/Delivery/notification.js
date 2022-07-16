const Delivery = require("../../models/Delivery");
const { dE } = require("../../shared/shared");
const sharedNotification = require("../Rate/sharedNotification");

const sendNotification = async (req, res, next) => {
  try {
    const find = await Delivery.findOne({ _id: req.body.delivery });
    req.find = find;
    req.message = { en: "You have a new Order", ar: "لديك طلب جديد" };
    sharedNotification.sharedNotification(req, res);
  } catch (error) {
    dE(res, error);
  }
};

module.exports = { sendNotification };
