const router = require("express").Router();
const auth = require("../../middleware/auth");
const billfndCont = require("../../controller/Bills/find");
const billUpdCont = require("../../controller/Bills/update");

router.get(
  "/between/:start/:end",
  auth.verifyTokenAndAdmin,
  billfndCont.findBetween
);

// ده الاى بى اى اللى بيغير حالات الاستلام لفواتير كتيره
router.put("/many-bills", auth.verifyTokenAndAdmin, billUpdCont.updateBills);

// التعديل عن طريق البائع بيبقى فى خانه التسليم لساتا فقط
router.put("/:id", auth.verifyAdminOrVendor, billUpdCont.updateById);

// الاى بى اى دى الغرض منها معرفه ارباح الشركه وهى عن طريق ان اعرض كل الفواتير اللى اتسلمت لساتا وساتا قبلتها
router.get(
  "/sata-profits",
  auth.verifyTokenAndAdmin,
  billfndCont.findSataProfits
);

// بتجيب الفلوس اللى كسبها البائع ده
// مستخدمها فى الداش بورد لما البائع يخش يعمل تسجيل دخول

router.get(
  "/vendor-profits",
  auth.verifyAdminOrVendor,
  billfndCont.vendorProfits
);

module.exports = router;
