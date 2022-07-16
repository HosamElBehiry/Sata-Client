const router = require("express").Router();
const { verifyTokenAndAdmin } = require("../../middleware/auth");
const { uploads } = require("../../shared/multer");
const blogAddCont = require("../../controller/Blog/add");
const blogUpdCont = require("../../controller/Blog/update");
const blogFndCont = require("../../controller/Blog/find");
const blogDelCont = require("../../controller/Blog/delete");

router.post(
  "/",
  verifyTokenAndAdmin,
  uploads.single("image"),
  blogAddCont.addNew
);

router.put(
  "/:id",
  verifyTokenAndAdmin,
  uploads.single("image"),
  blogUpdCont.updateById
);

// delete many blogs ..
router.delete("/many-blogs", verifyTokenAndAdmin, blogDelCont.deleteMany);

router.delete("/:id", verifyTokenAndAdmin, blogDelCont.deleteById);

router.get("/", blogFndCont.findAll);

// مستخدمها فى السايت فى صفحه المقالات
router.get("/:id", blogFndCont.findById);

module.exports = router;
