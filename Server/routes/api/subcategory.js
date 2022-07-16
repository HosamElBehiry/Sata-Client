const router = require("express").Router();
const SubCategory = require("../../models/SubCategory");
const { verifyTokenAndAdmin } = require("../../middleware/auth");
const sub = require("../../controller/SubCategory/subCategory");
const cat = require("../../controller/Category/category");
const updateCont = require("../../controller/SubCategory/update");
const subCatDelCont = require("../../controller/SubCategory/delete");
const subCatFndCont = require("../../controller/SubCategory/find");
const { uploads } = require("../../shared/multer");

router.post(
  "/",
  verifyTokenAndAdmin,
  uploads.single("image"),
  sub.addNew,
  cat.addSubCategoryId
);

// مستخدمها فى السايت العربى فى الصفحه بتاعت السيرش فقط
router.get("/", subCatFndCont.findAll);

router.get("/:id", async (req, res) => {
  await SubCategory.findById(req.params.id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({ msg: "Error from server", err });
    });
});

router.put(
  "/:id",
  verifyTokenAndAdmin,
  uploads.single("image"),
  updateCont.updateById
);

// soft delete many sub categories ..
router.delete("/many-sub/:id", verifyTokenAndAdmin, subCatDelCont.deleteMany);

router.delete("/:id", verifyTokenAndAdmin, subCatDelCont.deleteById);

// بتجيب كل الاقسام الفرعيه اللى الكاتيجورى بتاعها الاى دى ده
router.get("/category/:id", subCatFndCont.findByCatId);

module.exports = router;
