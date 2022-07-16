const router = require("express").Router();
const sliderAddCont = require("../../controller/Mobile/add");
const sliderFndCont = require("../../controller/Mobile/find");
const sliderUpdCont = require("../../controller/Mobile/update");
const sliderDltCont = require("../../controller/Mobile/delete");
const { verifyTokenAndAdmin } = require("../../middleware/auth");
const { uploads } = require("../../shared/multer");

router.post(
  "/",
  verifyTokenAndAdmin,
  uploads.single("image"),
  sliderAddCont.addNew
);

router.put(
  "/:id",
  verifyTokenAndAdmin,
  uploads.single("image"),
  sliderUpdCont.updateById
);

// مستخدمها فى الادمن بانل
router.get("/", sliderFndCont.findAll);

// مستخدمها فى السايت
router.get("/filter", sliderFndCont.filterBy);

// delete many sliders ..
router.delete("/many-sliders", verifyTokenAndAdmin, sliderDltCont.deleteMany);

router.get("/:id", sliderFndCont.findById);

router.delete("/:id", verifyTokenAndAdmin, sliderDltCont.deleteById);

module.exports = router;
