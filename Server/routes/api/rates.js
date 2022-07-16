const router = require("express").Router();
const auth = require("../../middleware/auth");
const ratingAddCont = require("../../controller/Rate/add");
const ratingFndCont = require("../../controller/Rate/find");
const ratingUpdCont = require("../../controller/Rate/update");

router.post("/", auth.verifytoken, ratingAddCont.addNew);

router.get("/", auth.verifyTokenAndAdmin, ratingFndCont.findAll);

// دى بتجيب كل اللى اتوافق عليه من الادمن بس
router.get("/type/:type", ratingFndCont.findByType);

// دى بديها الاى دى بتاع منتج معين بتجيب كل التقييمات اللى اتوافق عليها من الادمن
// مستخدمها فى السايت لحد دوقتى
router.get("/product/:id", ratingFndCont.findByProdId);

// دى بنجيب التقييم على المنتجات فقط او على عامل التوصيل فقط او او على البائع فقط
router.get(
  "/filter-rate/:type",
  auth.verifyTokenAndAdmin,
  ratingFndCont.findByRateType
);

router.put("/:id", auth.verifyTokenAndAdmin, ratingUpdCont.updateById);

module.exports = router;
