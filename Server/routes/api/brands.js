const router = require("express").Router();
const { verifyTokenAndAdmin } = require("../../middleware/auth");
const b = require("../../controller/Brand/brand");
const brandFindCont = require("../../controller/Brand/find");
const brandUpdtCont = require("../../controller/Brand/update");
const brandDeltCont = require("../../controller/Brand/delete");
const { uploads } = require("../../shared/multer");

router.post(
  "/",
  verifyTokenAndAdmin,
  uploads.single("image"),
  b.addNew,
  b.getAll
);

// soft delete many brands
router.delete("/many-brands", verifyTokenAndAdmin, brandDeltCont.deleteMany);

router.get("/", b.getAll);

// filter by category id ..
router.get("/category/:id", brandFindCont.filterByCategory);

// find by id
router.get("/:id", brandFindCont.findById);

router.delete("/:id", verifyTokenAndAdmin, brandDeltCont.deleteById);

router.put(
  "/:id",
  verifyTokenAndAdmin,
  uploads.single("image"),
  brandUpdtCont.updateById
);

module.exports = router;
