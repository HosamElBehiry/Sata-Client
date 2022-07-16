const router = require("express").Router();
const auth = require("../../middleware/auth");
const orderItem = require("../../controller/Orders/orderItems");
const orderItmFndCont = require("../../controller/OrderItems/find");
const det_own = require("../../controller/shared/req_owner");

router.get("/", auth.verifytoken, orderItem.findAll);

// هنا المفروض انى بستخدم الاى بى اى دى لما بدوس على الاعين اللى فى جدول الاوردر
router.get("/order/:id", auth.verifyTokenAndAdmin, orderItmFndCont.findbyOrdId);

// هنا بنديله الاى دى بتاع الجدول بتاع الديلفرى
router.get(
  "/OrderItemHavingDeliveryId/:id",
  auth.verifyTokenAndAdmin,
  orderItem.orderItemDelivery
);

router.get("/:id", auth.verifytoken, orderItem.findByID);

router.get("/last/:days/days", auth.verifyAdminOrVendor, det_own.ordItemOwner);

// بتجيب كل الاوردر ايتم اللى اتسلمت واتاخد فلوسها
router.get(
  "/type/deliverd",
  auth.verifyTokenAndAdmin,
  orderItmFndCont.findDeliverd
);

router.put("/:id", auth.verifytoken, orderItem.update);

module.exports = router;
