const Users = require("../../models/Users");
const notification = require("../Notifications/Notification");
const admin = require("../Admin/Admin");
const Vendor = require("../../models/Vendor");
const Delivery = require("../../models/Delivery");
const { dSuc } = require("../../shared/shared");

const sharedNotification = async (req, res) => {
  req.description = req.message;
  req.reciever = req.find.user.toString();
  const new_notification = await notification.notify(req, res);
  const updatedUser = await Users.updateOne(
    { _id: req.find.user.toString() },
    {
      $push: {
        Notifications: {
          $each: [new_notification._id],
          $position: 0,
        },
      },
    }
  );
  if (req.body.rate) {
    const user = await Users.findOne({ _id: req.find.user.toString() });
    const sum = 0;
    for (let r = 0; r < req.find.rate.all.length; r++) {
      sum += req.find.rate.all[r];
    }
    if (req.body.delivery) {
      const assignRateToDelivery = await Delivery.updateOne(
        { _id: req.body.delivery },
        {
          $push: {
            "rate.all": req.body.rate,
          },
          $set: {
            "rate.value": sum + req.body.rate / 5, // على اساس ان التقييم من 5
          },
        }
      );
    } else if (req.body.vendor) {
      const assignRateToVendor = await Vendor.updateOne(
        { _id: req.body.vendor },
        {
          $push: {
            "rate.all": req.body.rate,
          },
          $set: {
            "rate.value": sum + req.body.rate / 5, // على اساس ان التقييم من 5
          },
        }
      );
    } else {
      res.status(200).send("Not Yet !!");
    }
    req.description = `${req.user.fullname} gived ${user.fullname} ${req.body.rate} rate`;
    req.reciever = req.user._id;
    const notificationToAdmin = await notification.notify(req, res);
    req.notificationToAdmin = notificationToAdmin;
    admin.sendNotification(req, res);
  } else {
    dSuc(res, req.t("DISPLAY.SUCCESS"));
  }
};

module.exports = { sharedNotification };
