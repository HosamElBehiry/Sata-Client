/** @format */

const router = require("express").Router();
const { verifyAdminOrVendor, verifytoken } = require("../../middleware/auth");
const Offers = require("../../models/Offers");
const Notification = require("../../models/Notification");
const Users = require("../../models/Users");
const offer = require("../../controller/Offers/Offers");
const { dSuc } = require("../../shared/shared");

router.post("/", verifyAdminOrVendor, (req, res) => {
  const { price, from, to, quantity, products } = req.body;
  const new_offer = new Offers({
    price,
    from,
    to,
    quantity,
    products,
  });
  new_offer
    .save()
    .then((data) => {
      if (req.user.roles[0] === 2) {
        const new_notification = new Notification({
          user: req.user._id,
          description: `${req.user.fullname} added new Offer`,
        });
        new_notification
          .save()
          .then((notificationData) => {
            Users.updateOne(
              { _id: req.user._id },
              { $push: { Offers: data._id } }
            )
              .then(() => {
                Users.updateMany(
                  { role: "admin" },
                  {
                    $push: {
                      Notifications: {
                        $each: [notificationData._id],
                        $position: 0,
                      },
                    },
                  }
                )
                  .then(() => {
                    res.status(201).json(notificationData);
                  })
                  .catch((error) =>
                    res
                      .status(500)
                      .json({ msg: "Error while update notifications", error })
                  );
              })
              .catch((error) =>
                res.status(500).json({
                  msg: "Error while pushing Adding New Offers into user table",
                  error,
                })
              );
          })
          .catch((error) =>
            res
              .status(500)
              .json({ msg: "Error Creating new Notifications", error })
          );
      } else {
        res.status(201).json({ msg: "New Offer have been created ", data });
      }
    })
    .catch((error) => {
      res.status(500).json({ err: "Error from server", error });
    });
});

router.get("/", async (req, res) => {
  await Offers.find()
    .populate("products")
    .then((data) => {
      dSuc(res, data)
    })
    .catch((error) => {
      res.status(500).json({ msg: "error from server !!", error });
    });
});

router.get(
  "/offersRelatedToVendor",
  verifytoken,
  offer.getOffersRelatedToVendor
);

router.get("/:id", (req, res) => {
  Offers.findOne({ _id: req.params.id })
    .populate("products")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({ msg: "error from server !!", error });
    });
});

router.delete("/:id", verifyAdminOrVendor, (req, res) => {
  Users.findOne({ _id: req.user._id })
    .then((data) => {
      let flag = false;
      for (let i = 0; i < data.Offers.length; i++) {
        if (data.Offers[i].toString() === req.params.id) {
          flag = !flag;
          break;
        }
      }
      if (!flag) {
        res.status(404).json({ msg: "You are not Owner of this offer" });
      } else {
        Users.updateOne(
          { _id: req.user._id },
          { $pull: { Offers: req.params.id } }
        )
          .then((_) => {
            Offers.deleteOne({ _id: req.params.id })
              .then((_) => {
                const new_notification = new Notification({
                  description: `${req.user.fullname} deleted his offer`,
                  user: req.user._id,
                });
                new_notification
                  .save()
                  .then((notificationData) => {
                    Users.updateMany(
                      { role: "admin" },
                      {
                        $push: {
                          Notifications: {
                            $each: [notificationData._id],
                            $position: 0,
                          },
                        },
                      }
                    )
                      .then(() => {
                        res.status(201).json(notificationData);
                      })
                      .catch((error) =>
                        res.status(500).json({
                          msg: "Error while update notifications",
                          error,
                        })
                      );
                  })
                  .catch((error) =>
                    res.status(500).json({ msg: "Error from server !!", error })
                  );
              })
              .catch((error) =>
                res.status(500).json({ msg: "Error from server !!", error })
              );
          })
          .catch((error) =>
            res.status(500).json({ msg: "Error from server !!", error })
          );
      }
    })
    .catch((error) =>
      res.status(500).json({ msg: "Error from server !!", error })
    );
});

module.exports = router;
