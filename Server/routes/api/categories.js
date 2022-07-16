const router = require("express").Router();
const Category = require("../../models/Categories");
const { uploads } = require("../../shared/multer");
const { verifyTokenAndAdmin } = require("../../middleware/auth");
const updateCont = require("../../controller/Category/update");
const catDelCont = require("../../controller/Category/delete");
const catFndCont = require("../../controller/Category/find");

//Router api/categories
router.post(
  "/",
  verifyTokenAndAdmin,
  uploads.single("image"),
  async (req, res) => {
    const { showInMenu, showInHomepage, title_en, title_ar } = req.body;
    try {
      const category = new Category({
        "title.en": title_en,
        "title.ar": title_ar,
        showInMenu,
        showInHomepage,
        image: req.file ? req.file.path : "",
      });
      await category.save();
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ msg: "Server Error" });
    }
  }
);

router.put(
  "/:id",
  verifyTokenAndAdmin,
  uploads.single("image"),
  updateCont.updateById
);

router.get("/", catFndCont.findAll);

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// soft delete many categories ...
router.delete("/many-category", verifyTokenAndAdmin, catDelCont.deleteMany);

router.delete("/:id", verifyTokenAndAdmin, catDelCont.deleteById);

module.exports = router;
