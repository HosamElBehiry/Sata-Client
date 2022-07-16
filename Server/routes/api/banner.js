const router = require("express").Router();
const bannerAddCont = require("../../controller/Banner/add");
const bannerFndCont = require("../../controller/Banner/find");
const bannerUpdCont = require("../../controller/Banner/update");
const bannerDltCont = require("../../controller/Banner/delete");
const { verifyTokenAndAdmin } = require("../../middleware/auth");
const { uploads } = require("../../shared/multer");

router.post(
  "/",
  verifyTokenAndAdmin,
  uploads.single("image"),
  bannerAddCont.addNew
);

router.put(
  "/:id",
  verifyTokenAndAdmin,
  uploads.single("image"),
  bannerUpdCont.updateById
);

// delete many banners ..
router.delete("/many-banners", verifyTokenAndAdmin, bannerDltCont.deleteMany);

router.delete("/:id", verifyTokenAndAdmin, bannerDltCont.deleteById);

router.get("/", bannerFndCont.findAll);

// مستخدمها فى السايت الجديد اللى هو بتاع العربى بس
router.get("/type/:type", bannerFndCont.findByType);

router.get("/:id", bannerFndCont.findById);

module.exports = router;
