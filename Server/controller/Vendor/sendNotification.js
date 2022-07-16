const Users = require("../../models/Users");
const { dE } = require("../../shared/shared");

const sendNotification = async (req, res) => {
  try {
    const vendNotification = await Users.findByIdAndUpdate(req.reciever, {
      $push: {
        Notifications: {
          $each: [req.notificationToVendor._id],
          $position: 0,
        },
      },
    });
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { sendNotification };
