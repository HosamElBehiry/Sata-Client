const router = require("express").Router();
const { verifyTokenAndAdmin, verifytoken } = require("../../middleware/auth");
const Notification = require("../../models/Notification");
const notify = require("../../controller/Notifications/Notification");

router.post("/", verifytoken, notify.addNew);

router.get("/", verifyTokenAndAdmin, (req, res) => {
  Notification.aggregate([{ $sort: { createdAt: -1 } }])
    .then((data) => res.status(200).json(data))
    .catch((error) =>
      res.status(500).json({ msg: "Error from server !!", error })
    );
});

router.put("/:id", verifyTokenAndAdmin, (req, res) => {
  Notification.updateOne({ _id: req.params.id }, { $set: { isvisited: true } })
    .then((_) => {
      res.status(200).json({ msg: "Updated successfully" });
    })
    .catch((error) =>
      res.status(500).json({ msg: "Error from server !!", error })
    );
});

router.get("/NotificationByUser", verifytoken, notify.getUserNotification);

// test fcm ...

router.post("/fcm", notify.testFcm);

module.exports = router;
