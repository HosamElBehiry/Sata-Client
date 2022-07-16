const router = require("express").Router();
const wishAddCont = require("../../controller/WishLists/add");
const wishDelCont = require("../../controller/WishLists/delete");
const wishFndCont = require("../../controller/WishLists/find");
const { verifytoken, verifyTokenAndAdmin } = require("../../middleware/auth");

router.post("/", verifytoken, wishAddCont.addNew);

// دى بتجيب كل الويش ليستس اللى فى الموقع
router.get("/", verifyTokenAndAdmin, wishFndCont.findAll);

// بتجيب كل الويش ليستس بتوع يوزر معين
router.get("/user", verifytoken, wishFndCont.findByUsr);

// بديله الاى دى بتاع المنتج وبيقولى اذا كان موجود فى الويش ليست بتاع اليوزر ولا لا
// مستخدمها فى الموبايل
router.post("/isFav", verifytoken, wishFndCont.checkProdWishList);

// بديها الاى دى بتاعت الويش ليست وتمسحها
router.delete("/:id", verifytoken, wishDelCont.deleteById);

module.exports = router;
