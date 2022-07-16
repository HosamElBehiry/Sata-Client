const router = require("express").Router();
const {
  verifyTokenAndAdmin,
  verifyAdminOrVendor,
} = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
var moment = require("moment");
const Coupons = require("../../models/Coupons");

//Router api/Coupons
router.post(
  "/",
  [
    verifyAdminOrVendor,
    [
      check("amount", "This Field Is Reuired").not().isEmpty(),
      check("endDate", "This Field Is Reuired").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(500).json({ errors: errors.array() });
    }
    const { amount, isPrecent, aboutExpire, startDate, endDate } = req.body;
    try {
      var codeGenerate = codeGeneration();
      var dateStart = new Date(startDate);
      var dateEnd = new Date(endDate);
      const newCoupon = new Coupons({
        code: codeGenerate,
        amount: amount,
        startDate: dateStart,
        endDate: dateEnd,
      });
      const getCoupon = await Coupons.find({ code: codeGenerate });
      if (getCoupon.length > 0) {
        res.status(500).json({ msg: "This Code Generated Before" });
      } else {
        // console.log(newCoupon);
        await newCoupon.save();
        res.status(200).json(newCoupon);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
  }
);

//Router api/Coupons
//Delete
router.delete("/:id", verifyAdminOrVendor, async (req, res) => {
  try {
    await Coupons.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json({ msg: "This Voucher Deleted" });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

//Router api/Coupons
//update
router.put("/:id", verifyAdminOrVendor, async (req, res) => {
  try {
    var dateStart = new Date(req.body.startDate);
    var dateEnd = new Date(req.body.endDate);
    const updateCoupon = await Coupons.findByIdAndUpdate(
      { _id: req.params.id },
      [
        { $set: req.body },
        { $set: { startDate: dateStart } },
        { $set: { endDate: dateEnd } },
      ],
      { new: true }
    );
    res.status(200).json(updateCoupon);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

//Router api/Coupons
//GET Coupon By ID
router.get("/:id", verifyAdminOrVendor, async (req, res) => {
  try {
    const coupon = await Coupons.findOne({ _id: req.params.id });
    res.status(200).json(coupon);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

router.get("/", async (req, res) => {
  try {
    const coupon = await Coupons.find();
    res.status(200).json(coupon);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

router.get("/expire/soon", async (req, res) => {
  try {
    const coupon = await Coupons.find();
    var couponsArr = [];
    if (coupon.length > 0) {
      coupon.map((coup) => {
        let myendDate = new Date(coup.endDate);
        var getDiffer = calculateExpireDate(myendDate);
        if (getDiffer <= 2 && getDiffer > 0) {
          couponsArr.push(coup);
        }
      });
      if (couponsArr.length > 0) {
        res.status(200).json(couponsArr);
      } else {
        res.status(200).json(couponsArr);
      }
    } else {
      res.status(200).json({ msg: "There's no coupons" });
    }
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

//Function to generate Code

const codeGeneration = () => {
  var coupon = "";
  var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 6; i++) {
    coupon += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return coupon;
};

//function to generate ExpireDate
const calculateExpireDate = (endDate) => {
  let date = new Date(endDate);
  let dateNow = new Date();
  var a = moment(dateNow, "D/M/YYYY");
  var b = moment(date, "D/M/YYYY");
  var expiryDate = moment(b).diff(a, "days"); // Auto calculate this value( startTime + 1day)
  return expiryDate;
};

module.exports = router;
