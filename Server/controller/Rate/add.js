const Rating = require("../../models/Rating");
const Users = require("../../models/Users");
const notification = require("../Notifications/Notification");
const delivUpd = require("../Delivery/update");
const vendrUpd = require("../Vendor/update");
const prodUpdt = require("../Products/update");
const ordUpdat = require("../Orders/update");
const vendNotif = require("../Vendor/sendNotification");
const { dE, dNotPermit, dCre } = require("../../shared/shared");

// لو هيعمل تقييم لعامل توصيل هياخد الاى دى بتاع جدول الديلفرى
// لو عامل تقييم للبائع هياخد الاى دى اللى فى جدول البائع
const addNew = async (req, res) => {
  try {
    const { rate, product, comment, delivery, vendor, order } = req.body;
    const foundUser = await Users.findOne({ _id: req.user._id });
    if (delivery && foundUser.rating.indexOf(delivery) !== -1) {
      dNotPermit(res, req.t("ONLY.ONE.RATE"));
    } else if (product && foundUser.rating.indexOf(product) !== -1) {
      dNotPermit(res, req.t("ONLY.ONE.RATE"));
    } else if (vendor && foundUser.rating.indexOf(vendor) !== -1) {
      dNotPermit(res, req.t("ONLY.ONE.RATE"));
    } else if (order && foundUser.rating.indexOf(order) !== -1) {
      dNotPermit(res, req.t("ONLY.ONE.RATE"));
    } else {
      const new_rate = await new Rating({
        user: req.user._id,
        rate,
        product,
        comment,
        delivery,
        vendor,
        order,
      }).save();
      const pushId = await Users.findByIdAndUpdate(req.user._id, {
        $push: {
          rating: delivery
            ? delivery
            : product
            ? product
            : vendor
            ? vendor
            : order,
        },
      });
      req.description = {
        en: `${req.user.fullname} gived you ${rate} rate`,
        ar: `${req.user.fullname} بواسطه ${rate} قد تم اضافه تقييم`,
      };
      if (delivery) {
        await delivUpd.updateRate(req, res);
      } else if (vendor) {
        await vendrUpd.updateRate(req, res);
      } else if (order) {
        await ordUpdat.updateRate(req, res);
      } else {
        await prodUpdt.updateRate(req, res);
      }
      // هنا انا عملت كده عشان فى حاله الاوردر لازم الادمن هو اللى ياخد الاشعار
      if (!order) {
        req.notificationToVendor = await notification.notify(req, res);
        vendNotif.sendNotification(req, res);
        dCre(res, req.t("DISPLAY.SUCCESS"));
      }
    }
  } catch (error) {
    dE(res, error);
  }
};

module.exports = { addNew };
