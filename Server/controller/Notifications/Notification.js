const Notification = require("../../models/Notification");
const Users = require("../../models/Users");
const Fcm = require("fcm-node");
const { dE, dSuc } = require("../../shared/shared");

const addNew = async (req, res) => {
  try {
    const { description_en, description_ar, users, user } = req.body;
    const new_notification = new Notification({
      "description.en": description_en,
      "description.ar": description_ar,
      users,
      user,
    });
    const notificationData = await new_notification.save();
    if (users.length > 0) {
      const updateUsers = await Users.updateMany(
        { _id: { $in: users } },
        {
          $push: {
            Notifications: {
              $each: [notificationData._id],
              $position: 0,
            },
          },
        }
      );
    }
    res.status(201).json({ msg: "Notification has been sent !" });
  } catch (error) {
    dE(res, error);
  }
};

const notify = async (req, res) => {
  try {
    const new_notification = new Notification({
      description: req.description,
      user: req.reciever,
    });
    const notificationData = await new_notification.save();
    return notificationData;
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// for mobile
const getUserNotification = async (req, res) => {
  try {
    const notifications = await Users.findOne({ _id: req.user._id })
      .populate("Notifications")
      .select("Notifications");
    res.status(200).json(notifications);
  } catch (error) {
    dE(res, error);
  }
};

const testFcm = async (req, res) => {
  try {
    const fcm = new Fcm(process.env.SERVER_KEY);
    var message = {
      //this may vary according to the message type (single recipient, multicast, topic, et cetera)
      to: "dY4U2DpJRuCIs6fq_oeaLx:APA91bHvJ3FTv09tHD0R1CRkmQ9ULRHvvq69pSt8HztqaHEIBeBP3Vquxivcu8-OC1mnNiaZ8SDqXU4Pj88-3VQHFTl3HTvwjF6NQW9WPXjF5vJDnDgdg68USCL5BOZPvbiuWKU71VyS",
      // collapse_key: 'your_collapse_key',

      notification: {
        title: "Title of your push notification",
        body: "Body of your push notification",
      },
    };

    fcm.send(message, function (err, response) {
      if (err) {
        console.log("Something has gone wrong!");
      } else {
        console.log("Successfully sent with response: ", response);
      }
    });
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { addNew, notify, getUserNotification, testFcm };
