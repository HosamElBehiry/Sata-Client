const router = require("express").Router();
const Region = require("../../models/Region");
const { verifyTokenAndAdmin } = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const City = require("../../models/City");
//Router api/country
router.post(
  "/",
  [
    verifyTokenAndAdmin,
    [
      check("region_en", "This Field Is Reuired").not().isEmpty(),
      check("region_ar", "This Field Is Reuired").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ errors: errors.array() });
    }

    const { region_en, region_ar, cityId, price, countryId } = req.body;
    try {
      const newRegion = new Region({
        "region.en": region_en,
        "region.ar": region_ar,
        cityId,
        countryId,
        price,
      });
      await newRegion.save();
      res.status(200).json(newRegion);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }
);

//GET AL Regions
router.get("/", async (req, res) => {
  try {
    const region = await Region.find()
      .populate("countryId")
      .populate("cityId")
      .sort({ title: 1 });
    res.status(200).json(region);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

//Router Put api/city/id
//Edit city title
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updateRegion = await Region.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          "region.en": req.body.region_en,
          "region.ar": req.body.region_ar,
          countryId: req.body.countryId,
          cityId: req.body.cityId,
          price: req.body.price,
        },
      },
      { new: true }
    );
    res.status(200).json(updateRegion);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

//Router delete api/city/id
//delete city title
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Region.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Region Deleted" });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

//Router delete api/city/id
//delete city title
router.get("/:id", async (req, res) => {
  try {
    const reg = await Region.findById(req.params.id);
    res.status(200).json(reg);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// الموبايل مستخدمها

router.get("/getCityByCountryId/:country_id", async (req, res) => {
  try {
    const city = await City.find({ country: req.params.country_id }).populate(
      "country"
    );
    res.status(200).json(city);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

//Router GET api/city/:country
//get cities by Country
// الموبايل هو اللى مستخدمها لحد دلوقتى

router.get("/getRegionsByCityId/:city_id", async (req, res) => {
  try {
    const region = await Region.find({ cityId: req.params.city_id })
      .populate("countryId")
      .populate("cityId");
    res.status(200).json(region);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
