const router = require("express").Router();
const countryAddCont = require("../../controller/Country/add");
const countryFndCont = require("../../controller/Country/find");
const countryUpdCont = require("../../controller/Country/update");
const countryDltCont = require("../../controller/Country/delete");
const { uploads } = require("../../shared/multer");
const { verifyTokenAndAdmin } = require("../../middleware/auth");

router.post(
  "/",
  verifyTokenAndAdmin,
  uploads.single("image"),
  countryAddCont.addNew
);

router.put(
  "/:id",
  verifyTokenAndAdmin,
  uploads.single("image"),
  countryUpdCont.updateById
);

// مستخدمها عشان لما احى امسح كذا بلد مع بعض
router.delete("/many-country", verifyTokenAndAdmin, countryDltCont.deleteMany);

router.delete("/:id", verifyTokenAndAdmin, countryDltCont.deleteById);

router.get("/", countryFndCont.findAll);

router.get("/:id", countryFndCont.findById);

module.exports = router;
