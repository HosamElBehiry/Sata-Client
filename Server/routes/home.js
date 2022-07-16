const Banner = require("../models/Banner");
const Categories = require("../models/Categories");
const MobileSlider = require("../models/MobileSlider");
const Offers = require("../models/Offers");
const Products = require("../models/Products");
const Rating = require("../models/Rating");
const router = require("express").Router();

router.get("/", async (req, res) => {
  await MobileSlider.find()
    .then(async (mobileSliderData) => {
      await Banner.find()
        .then(async (bannerData) => {
          await Categories.find({ showInMenu: true })
            .then(async (categoryData) => {
              await Offers.find()
                .limit(5)
                .then(async (offerData) => {
                  await Products.find()
                    .sort({ createdAt: -1 })
                    .limit(4)
                    .then(async (productsData) => {
                      await Rating.find({
                        $or: [
                          { rate: { $gte: 3 } },
                          { rate: { $gte: 4 } },
                          { rate: { $gte: 5 } },
                        ],
                      })
                        .then((ratesData) => {
                          res.status(200).json({
                            mobileSliderData,
                            bannerData,
                            categoryData,
                            offerData,
                            productsData,
                            ratesData,
                          });
                        })
                        .catch((error) =>
                          res
                            .status(500)
                            .json({ msg: "error from server !!", error })
                        );
                    })
                    .catch((error) =>
                      res
                        .status(500)
                        .json({ msg: "error from server !!", error })
                    );
                })
                .catch((error) =>
                  res.status(500).json({ msg: "error from server !!", error })
                );
            })
            .catch((error) =>
              res.status(500).json({ msg: "error from server !!", error })
            );
        })
        .catch((error) =>
          res.status(500).json({ msg: "error from server !!", error })
        );
    })
    .catch((error) =>
      res.status(500).json({ msg: "Error from server !!", error })
    );
});

module.exports = router;
