const ReturnedProducts = require("../../models/ReturnedProducts");
const OrderItems = require("../../models/OrderItem");
const Vendor = require("../../models/Users");
const retProdFindCont = require("./find");
const notifCont = require("../Notifications/Notification");
const vendSendNotif = require("../Vendor/sendNotification");
const { dE } = require("../../shared/shared");

const addNew = async (req, res) => {
  try {
    const { ordItm, description, status, shipping } = req.body;
    const newRetProd = await new ReturnedProducts({
      ordItm,
      description,
      status,
      shipping,
    }).save();
    // send notification to vendor
    const ordItem = await OrderItems.findById(ordItm);
    const vendor = await Vendor.findOne({ Products: ordItem.product });
    req.description = {
      en: `${req.user.fullname} refused an order`,
      ar: `قد تم طلب ارجاع بواسطه ${req.user.fullname}`,
    };
    req.reciever = vendor._id;
    req.notificationToVendor = await notifCont.notify(req, res);
    vendSendNotif.sendNotification(req, res);
    req.newRetProd = newRetProd;
    retProdFindCont.findById(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { addNew };
