const router = require("express").Router();
const { validationResult } = require("express-validator");
const { verifytoken } = require("../../middleware/auth");
const { uploads } = require("../../shared/multer");
const jwt = require("jsonwebtoken");
const User = require("../../models/Users");
const Worker = require("../../models/Worker");
const bcrypt = require("bcrypt");
const Notification = require("../../models/Notification");
const nodemailer = require("nodemailer");
const Vendor = require("../../models/Vendor");
const Delivery = require("../../models/Delivery");
const CompanyShipping = require("../../models/ShippingCompany");

router.post(
  "/register",
  uploads.fields([
    { name: "taxcard_front", maxCount: 1 },
    { name: "taxcard_back", maxCount: 1 },
    { name: "commercialRecord", maxCount: 1 },
    { name: "licence_front", maxCount: 1 },
    { name: "licence_back", maxCount: 1 },
    { name: "licenceCar_front", maxCount: 1 },
    { name: "licenceCar_back", maxCount: 1 },
    { name: "drugAnalysis", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),

  async (req, res) => {
    const { fullname, email, password, role, telephone, mobile } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(500)
          .json({ errors: [{ msg: "user already exists" }] });
      }

      user = new User({
        fullname,
        email,
        password,
        role,
        telephone,
        mobile,
        image: !req.files ? "" : req.files.image[0].path,
        status:
          role === "user" || role === "admin"
            ? "Confirmed"
            : req.body.isAddedByAdmin === "true"
            ? "Confirmed"
            : "Pending",
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user
        .save()
        .then((new_user) => {
          if (role === "worker") {
            registerWorker(req, res, new_user);
          } else if (user.role === "vendor") {
            registerVendor(req, res, user);
          } else if (user.role === "delivery") {
            registerDelivery(req, res, user);
          } else {
            makePayload(res, user);
          }
        })
        .catch((error) => {
          res.status(500).json({ msg: "Error from server !!", error });
        });
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }
);

const registerDelivery = async (req, res, user) => {
  var licence_expiration_date = new Date(req.body.licence_expiration);
  var licenceCar_expiration_expiration_date = new Date(
    req.body.licenceCar_expiration
  );
  const new_delivery = new Delivery({
    user: user._id,
    licence_front: !req.files ? "" : req.files.licence_front[0].path,
    licence_back: !req.files ? "" : req.files.licence_back[0].path,
    licenceCar_front: !req.files ? "" : req.files.licenceCar_front[0].path,
    licenceCar_back: !req.files ? "" : req.files.licenceCar_back[0].path,
    drugAnalysis: !req.files ? "" : req.files.drugAnalysis[0].path,
    company: req.body.company,
    licence_expiration: licence_expiration_date,
    licenceCar_expiration: licenceCar_expiration_expiration_date,
  });
  await new_delivery
    .save()
    .then(async (newDelivery) => {
      const new_notification = new Notification({
        "description.en": `${newDelivery.fullname} has been registerd to the system`,
        "description.ar": `${newDelivery.fullname} قد تم اضافه`,
        user: newDelivery._id,
      });
      new_notification
        .save()
        .then(async (notificationData) => {
          await CompanyShipping.updateOne(
            { _id: req.body.company },
            {
              $push: {
                Notification: {
                  $each: [notificationData._id],
                  $position: 0,
                },
              },
            }
          )
            .then(async () => {
              makePayload(res, user);
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
};

const registerVendor = async (req, res, user) => {
  var taxcard_expiration_date = new Date(req.body.taxcard_expiration);
  var commericalRecord_expiration_date = new Date(
    req.body.commericalRecord_expiration
  );
  const newVendor = new Vendor({
    user: user._id,
    taxcard_front: !req.files ? "" : req.files.taxcard_front[0].path,
    taxcard_back: !req.files ? "" : req.files.taxcard_back[0].path,
    commercialRecord: !req.files ? "" : req.files.commercialRecord[0].path,
    app_balance_type: req.body.app_balance_type,
    app_balance_amount: req.body.app_balance_amount,
    taxcard_expiration: taxcard_expiration_date,
    commericalRecord_expiration: commericalRecord_expiration_date,
  });
  await newVendor
    .save()
    .then(async (new_vendor) => {
      const new_notification = new Notification({
        "description.en": `New Vendor has been created `,
        "description.ar": `قد تم اضافه بائع جديد`,
        user: new_vendor._id,
      });
      await new_notification
        .save()
        .then(async (notificationData) => {
          await User.updateMany(
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
              makePayload(res, user);
            })
            .catch((error) =>
              res
                .status(500)
                .json({ msg: "Error while update notifications", error })
            );
        })
        .catch((error) =>
          res.status(500).json({ msg: "Error from server !!", error })
        );
    })
    .catch((error) =>
      res.status(500).json({ msg: "Error from server !!", error })
    );
};

const registerWorker = async (req, res, new_user) => {
  await Vendor.findOne({ user: req.body.vendor })
    .then(async (vendTab) => {
      const new_worker = new Worker({
        user: new_user._id,
        canAdd: req.body.canAdd,
        canUpdate: req.body.canUpdate,
        canDelete: req.body.canDelete,
        vendor: vendTab._id,
      });
      await new_worker
        .save()
        .then(async (workerData) => {
          await Vendor.updateOne(
            { user: req.body.vendor },
            { $push: { workers: workerData._id } }
          )
            .then(async () => {
              makePayload(res, new_user);
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
      res.status(500).json({ msg: "Error from server ", error })
    );
};

const makePayload = (res, user) => {
  const payload = {
    _id: user._id,
    username: user.fullname,
    online: true,
    Offers: user.Offers,
    Notifications: user.Notifications,
    email: user.email,
    authToken: "",
    refreshToken: "",
    roles:
      user.role === "user"
        ? [0]
        : user.role === "admin"
        ? [1]
        : user.role === "vendor"
        ? [2]
        : user.role === "worker"
        ? [3]
        : [4],
    pic: user.image,
    fullname: user.fullname,
    phone: user.telephone,
    mobile: user.mobile,
  };
  jwt.sign(
    payload,
    process.env.JWT_SEC,
    // { expiresIn: "3d" },
    (err, token) => {
      if (!token) res.status(404).json({ msg: "No Token " });
      else {
        payload.authToken = token;
        payload.refreshToken = token;
        res.status(201).json({ token });
      }
    }
  );
};

//Login Account
router.post("/login", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user || user.status === "Blocked" || user.isDeleted === true) {
      return res.status(403).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    const isMatching = await bcrypt.compare(password, user.password);
    if (!isMatching) {
      return res.status(403).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    const payload = {
      _id: user._id,
      username: user.fullname,
      online: true,
      Offers: user.Offers,
      Notifications: user.Notifications,
      email: user.email,
      authToken: "",
      refreshToken: "",
      roles:
        user.role === "user"
          ? [0]
          : user.role === "admin"
          ? [1]
          : user.role === "vendor"
          ? [2]
          : user.role === "worker"
          ? [3]
          : [4],
      fullname: user.fullname,
      phone: user.telephone,
      mobile: user.mobile,
      image: user.image,
      pic: user.image,
      status: user.status,
    };
    jwt.sign(
      payload,
      process.env.JWT_SEC,
      // { expiresIn: "3d" },
      (err, token) => {
        if (err) res.status(404).json({ msg: "No Token " });
        payload.authToken = token;
        payload.refreshToken = token;
        User.updateOne(
          { _id: payload._id },
          { $set: { online: true, loggedAt: new Date() } }
        )
          .then(() => {
            res.status(200).json({ token, payload });
          })
          .catch(() => {
            res.status(500).json({ msg: "Server Error" });
          });
      }
    );
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});

router.get("/logout", verifytoken, (req, res) => {
  User.updateOne({ _id: req.user._id }, { $set: { online: false } })
    .then(() => {
      res.status(200).json({ msg: "You Logged Out Successfully " });
    })
    .catch((error) => {
      res.status(500).json({ msg: "Error from server !!", error });
    });
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  await User.findOne({ email })
    .then((data) => {
      if (data) {
        const secret = process.env.JWT_SEC + data.password;
        const payload = {
          email: data.email,
          id: data._id,
        };
        const token = jwt.sign(payload, secret, { expiresIn: "5m" });
        const link = `http://176.123.3.43:4000/admin/auth/reset-password/${data._id}/${token}`;
        var transporter = nodemailer.createTransport({
          host: "smtp.mailtrap.io",
          port: 587,
          auth: {
            user: "f5a32b70448826",
            pass: "e5a34395e3bba7",
          },
        });
        const options = {
          from: "email@domain.com",
          to: email,
          subject: "Recover Email Address",
          html: `<a href='${link}'>Recover Email Address</a>`,
        };
        transporter.sendMail(options, (err, info) => {
          if (err) {
            res.status(500).json({ msg: "Error from server !!", err });
          } else {
            res.status(200).json({
              msg: "Sent Successfully !! ",
              info,
            });
          }
        });
      } else {
        res.status(404).json({ msg: "Email not found " });
      }
    })
    .catch((error) => {
      res.status(500).json({ msg: "Error from server !!", error });
    });
});

router.get("/reset-password/:id/:token", (req, res) => {
  const { id, token } = req.params;
  User.findOne({ _id: id })
    .then((data) => {
      if (data) {
        try {
          const secret = process.env.JWT_SEC + data.password;
          const payload = jwt.verify(token, secret);
          res
            .status(200)
            .json({ msg: "Valid User and valid token", email: data.email });
        } catch (error) {
          res.status(401).json({ error, msg: "You are not The Real User" });
        }
      } else {
        res.status(404).json({ msg: "You are not the owner of this account " });
      }
    })
    .catch((error) => {
      res.status(500).json({ msg: "Error from server !!", error });
    });
});

router.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  User.findOne({ _id: id })
    .then((data) => {
      if (data) {
        try {
          const secret = process.env.JWT_SEC + data.password;
          const payload = jwt.verify(token, secret);
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              res.status(500).json({ error: err });
            } else {
              User.updateOne({ _id: id }, { $set: { password: hash } })
                .then(() => {
                  res
                    .status(200)
                    .json({ msg: "Password updated successfully " });
                })
                .catch((error) => {
                  res.status(500).json({ msg: "Error from Server !! ", error });
                });
            }
          });
        } catch (error) {
          res.status(500).json({ msg: "Error Invalid ", error });
        }
      } else {
        res.status(404).json({ msg: "You are not thw owner of this account " });
      }
    })
    .catch((error) => {
      res.status(500).json({ msg: "Error from server !!", error });
    });
});

router.get("/", verifytoken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
