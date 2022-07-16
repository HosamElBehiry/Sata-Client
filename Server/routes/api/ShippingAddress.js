const router = require("express").Router();
const Country = require("../../models/Country");
const { verifyTokenAndAdmin, verifytoken } = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const shippingAddress = require("../../models/shippingAddress");

//Router api/country
router.post(
  "/",
  verifytoken,
  async (req, res) => {
    const { address, longitude,latitude } = req.body;
    try {
      const newShippingAddress = new shippingAddress({
        longitude: longitude,
        latitude: latitude,
        address:address,
        user:req.user._id
      });
      await newShippingAddress.save();
      res.status(200).json(newShippingAddress);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }
);

//GET All Address For User
router.get("/",verifytoken, async (req, res) => {
  try {

    const address = await shippingAddress.find({user:req.user._id})
    res.status(200).json(address);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
