const router = require("express").Router();
const {
  verifytoken,
  verifyAdminOrVendor,
  verifyTokenAndAdmin,
} = require("../../middleware/auth");
const { uploads } = require("../../shared/multer");
const Worker = require("../../models/Worker");
const Vendor = require("../../models/Vendor");
const p = require("../../controller/Products/product");
const prodAddCont = require("../../controller/Products/add");
const owner = require("../../controller/shared/req_owner");
const prodDelCont = require("../../controller/Products/delete");
const prodFindCont = require("../../controller/Products/find");
const prodUpdtCont = require("../../controller/Products/update");

router.post("/", verifytoken, uploads.array("image", 7), async (req, res) => {
  if (req.user.roles[0] === 2 || req.user.roles[0] === 1) {
    // admin or vendor
    prodAddCont.letAdminOrVendorAddProduct(req, res, true);
  } else {
    // check if he is a worker and he has permission to add product from his vendor
    checkWorker(req, res);
  }
});

// دى بتجيب اكتر منتج اتباع
router.get(
  "/most-bought-product",
  verifyAdminOrVendor,
  prodFindCont.mostBought
);

// اكتر منتج اتشاف
router.get(
  "/most-watched-product",
  verifyAdminOrVendor,
  prodFindCont.mostVisited
);

// دى بتجيب كل المنتجات اللى بيها نفس العلامه التحاريه
router.get("/brand/:id", verifyTokenAndAdmin, prodFindCont.filterByBrand);

// product that have same category or sub category id
router.get("/filtCatSub/:id", prodFindCont.filterByCatSub);

// بديها جزء من اسم الكاتيجورى او الصب كاتيجورى او البراند او الاسم وتجيب المنتجات
router.get("/search-prod", prodFindCont.allPossibleSearch);

// دى اللى بتجيب كل المنتجات الخاصه ببائع معين
// الاى بى اى ديه الغرض منها ان البائع لما يدخل الاكونت بتاعه يقدر يشوف
// المنتجات الخاصه بيه هو بس عشان يقدر يعدل ويمسح فيها زى مهو عايز
router.get("/vendorProducts", verifytoken, p.getVendorProducts);

const checkWorker = async (req, res) => {
  await Worker.findOne({ user: req.user._id })
    .populate("user")
    .then((workerData) => {
      if (workerData.canAdd) {
        Vendor.findOne({ _id: workerData.vendor })
          .then((vendorData) => {
            letAdminOrVendorAddProduct(req, res, vendorData.user);
          })
          .catch((error) =>
            res.status(500).json({ msg: "Error from server !!", error })
          );
      } else {
        res
          .status(403)
          .json({ msg: "You haven't any permission to add this product " });
      }
    })
    .catch((error) =>
      res.status(500).json({ msg: "Error from server !!", error })
    );
};

router.put("/:id", verifytoken, uploads.array("image", 7), owner.detOwner);

// for mobile :)
router.put(
  "/img-prod-upd/:id",
  verifyAdminOrVendor,
  uploads.single("image"),
  prodUpdtCont.updGalImg
);

// مستخدمها فى السايت فى الحته اللى فى الهوم بيدج اللى قبل البراندات
router.get("/newProduct", p.getNews);

// مستخدمها فى السايت فى الحته اللى فى الهوم بيدج اللى قبل البراندات
router.get("/most-rated", prodFindCont.mostRated);

// بتجيب المنتجات الاقل فى الكميه
router.get("/lowest", prodFindCont.getLowest);

// بتجيب اعلى 5 اتباعو
router.get("/mostBought", prodFindCont.mostBoughtProducts);

// منتجات ليها نفس الكاتيجورى اى دى او نفس الصب
// كاتيجورى اى دى او نفس البراند اى دى
// مستخدمها فى السايت فى الحته اللى تحت تفاصيل المنتج على طول
router.get("/related-prod/:id", prodFindCont.relatedProducts);

// دى بتجيب اخر 4 منتحات اتضافو فى السستم
router.get("/latest", prodFindCont.last6Products);

//GET Product By ID
router.get("/:id", p.getProductByID);

// find All
router.get("/", prodFindCont.findAll);

// مستخدمها عشان اعمل سوفت ديليت لكذا منتج
// خلى بالك ان البائع ممكن يدخل يمسح منتجاته كمان
router.delete("/many-products", verifyAdminOrVendor, prodDelCont.deleteMany);

router.delete("/:id", verifyAdminOrVendor, prodDelCont.deleteById);

module.exports = router;
