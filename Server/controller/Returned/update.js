const ReturnedProducts = require("../../models/ReturnedProducts");
const findRetCont = require("./find");
const Vendor = require("../../models/Users");
const OrderItems = require("../../models/OrderItem");
const vendSendNotif = require("../Vendor/sendNotification");
const notifCont = require("../Notifications/Notification");
const { dE, dNotPermit } = require("../../shared/shared");

const updateById = async (req, res) => {
  try {
    const ordItem = await OrderItems.findById(req.body.ordItm);
    const vendor = await Vendor.findOne({ Products: ordItem.product });
    if (req.user.roles[0] === 1) {
      req.description = {
        en: "Admin updated Your Returned Product",
        ar: "قد تم تعديل حاله المنتج المرجوع بواسطه الادمن",
      };
      req.reciever = vendor._id;
      req.notificationToVendor = await notifCont.notify(req, res);
      vendSendNotif.sendNotification(req, res);
      const updRet = await ReturnedProducts.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      findRetCont.findById(req, res);
    } else {
      const newOrdItm = await ordItem.populate("product");
      if (newOrdItm.product.user.toString() !== req.user._id) {
        dNotPermit(res, req.t("NOT.PERMITTED"));
      } else {
        const updRet = await ReturnedProducts.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        findRetCont.findById(req, res);
      }
    }
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { updateById };
