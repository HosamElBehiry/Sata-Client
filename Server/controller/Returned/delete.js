const OrderItem = require("../../models/OrderItem");
const Vendor = require("../../models/Users");
const findRetCont = require("./find");
const notifCont = require("../Notifications/Notification");
const vendSendNotif = require("../Vendor/sendNotification");
const ReturnedProducts = require("../../models/ReturnedProducts");
const { dE, dSuc, dNotPermit } = require("../../shared/shared");

const deleteById = async (req, res) => {
  try {
    req.isDeleted = true;
    const retProd = await findRetCont.findById(req, res);
    const ordItem = await OrderItem.findById(retProd.ordItm.toString());
    const vendor = await Vendor.findOne({ Products: ordItem.product });
    if (req.user.roles[0] === 1) {
      req.description = {
        en: "Admin deleted Your Returned Product",
        ar: "قد تم مسح المنتج المرجوع بواسطه الادمن",
      };
      req.reciever = vendor._id;
      req.notificationToVendor = await notifCont.notify(req, res);
      vendSendNotif.sendNotification(req, res);
      const updRet = await ReturnedProducts.findByIdAndUpdate(req.params.id, {
        $set: { isDeleted: true },
      });
      dSuc(res, req.t("DELETED.SUCCESSFULLY"));
    } else {
      const newOrdItm = await ordItem.populate("product");
      if (newOrdItm.product.user.toString() !== req.user._id) {
        dNotPermit(res, req.t("NOT.PERMITTED"));
      } else {
        const updRet = await ReturnedProducts.findByIdAndUpdate(req.params.id, {
          $set: { isDeleted: true },
        });
        dSuc(res, req.t("DELETED.SUCCESSFULLY"));
      }
    }
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};
module.exports = { deleteById };
