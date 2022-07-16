const router = require("express").Router();
const auth = require("../../middleware/auth");
const vend = require("../../controller/Vendor/Vendor");
const vendFindCont = require("../../controller/Vendor/find");

// بتجيب كل البائعين
router.get("/", auth.verifyTokenAndAdmin, vend.getAll);

// بتجيب كل معلومات البائع فى جدول البائعين
router.get("/vend-info", auth.verifyAdminOrVendor, vendFindCont.findvendInfo);

// دى عشان الصفحه بتاعت البروفايل اللى متفق عليها
// ملحوظه هامه : الاى دى اللى هنا ده تبع جدول اليوزر
router.get(
  "/profile/:id",
  auth.verifyTokenAndAdmin,
  vendFindCont.vendorProfile
);

// بتجيب كل التقارير الخاصه بالبائع ده
router.get("/reports", auth.verifyAdminOrVendor, vendFindCont.getVendReports);

// بتجيب عموله ساتا مول الخاصه من كل البائعين
// كمان بتجيب ارباح المتاجر
router.get(
  "/profits-commissions",
  auth.verifyTokenAndAdmin,
  vendFindCont.getProfitCommissions
);

// get Vendor By user Id
router.get("/:id", auth.verifyTokenAndAdmin, vendFindCont.findByUserId);

module.exports = router;
