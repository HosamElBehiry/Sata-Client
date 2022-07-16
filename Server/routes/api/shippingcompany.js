const router = require("express").Router();
const jwt = require("jsonwebtoken");
const {
  verifyTokenAndAdmin,
  verifyAdminOrVendor,
} = require("../../middleware/auth");
const ShippingCompany = require("../../models/ShippingCompany");
const Users = require("../../models/Users");
const Notification = require("../../models/Notification");
const { uploads } = require("../../shared/multer");
const bcrypt = require("bcrypt");
const companyFindCont = require("../../controller/CompanyShipping/find");
const companyUpdtCont = require("../../controller/CompanyShipping/update");

router.post("/register", uploads.single("logo"), async (req, res) => {
  const { name, address, telephone, mobile, email, password } = req.body;
  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      res.status(500).json({ msg: "Error from server !!", err });
    } else {
      const new_shipping_company = new ShippingCompany({
        email,
        password: hash,
        name,
        address,
        telephone,
        mobile,
        logo: req.file && req.file.path,
      });
      await new_shipping_company
        .save()
        .then(async (newShipping) => {
          const new_notification = new Notification({
            "description.en": `New Company have been Registerd to The System`,
            "description.ar": `قد تم اضافه شركه جديده الى النظام`,
            user: newShipping._id,
          });
          await new_notification
            .save()
            .then(async (notificationData) => {
              await Users.updateMany(
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
                  makePayload(res, newShipping);
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
    }
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  await ShippingCompany.findOne({ email })
    .then(async (data) => {
      if (data === null) {
        res.status(404).json({ msg: "Email Not Found" });
      } else {
        await bcrypt.compare(password, data.password, async (err, result) => {
          if (err) {
            res.status(500).json({ msg: "Error from server !!", err });
          } else if (!result) {
            res.status(404).json({ msg: "Invalid Credentials" });
          } else {
            makePayload(res, data);
          }
        });
      }
    })
    .catch((error) =>
      res.status(500).json({ msg: "Error from server !!", error })
    );
});

const makePayload = async (res, newShipping) => {
  const { _id, email, name, telephone, mobile } = newShipping;
  const payload = { _id, email, name, telephone, mobile };
  jwt.sign(payload, process.env.JWT_SEC, { expiresIn: "3d" }, (err, token) => {
    if (err) {
      res.status(500).json({ msg: "Error from server !!", err });
    } else {
      res.status(200).json({ token });
    }
  });
};

router.get("/", verifyAdminOrVendor, companyFindCont.findAll);

router.get("/:id", verifyTokenAndAdmin, companyFindCont.findById);

// الحته دى بتاعت لما بعمل سوفت ديليت لكذا شركه مع بعض
router.put(
  "/many-comp",
  verifyTokenAndAdmin,
  companyUpdtCont.updateManyCompanies
);

router.put(
  "/:id",
  verifyTokenAndAdmin,
  uploads.single("logo"),
  companyUpdtCont.updateById
);

module.exports = router;
