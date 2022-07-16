const router = require("express").Router();
const auth = require("../../middleware/auth");
const deliv = require("../../controller/Delivery/delivery");
const delivFindCont = require("../../controller/Delivery/find");

// بتجيب كل عمال التوصيل
router.get("/", auth.verifyAdminOrVendor, delivFindCont.findAll);

// الاوردرات اللى هو سلمها
router.get("/done-orders", auth.verifytoken, deliv.assignedOrders);

// الاوردرات اللى عليه بس متسلمتش
router.get("/orders-assigned-not-done", auth.verifytoken, deliv.assignedOrders);

// معموله للموبايل
router.post(
  "/change-in-order-state",
  auth.verifytoken,
  deliv.changeOnlineState
);

router.get("/current-state", auth.verifytoken, deliv.getCurrentState);

// دى كل ميتغير مكانه يتسجل فى الداتا بيز اللوكيشن الجديد بتاعه
router.post("/change-location", auth.verifytoken, deliv.changeLocation);

// دى لما الديلفرى بيتعمله assign لاوردر واحد او اكتر فيوافق انه يوصلهم فيتغير حالتهم من confirmed -> onDelivery
router.post("/update-order-items", auth.verifytoken, deliv.updateOrderItems);

// هنا بديله الاى دى بتاعه اللى فى جدول اليوزر يجيبلى المعلومات بتاعته
router.get("/:id", auth.verifyTokenAndAdmin, delivFindCont.findByUsrId);

module.exports = router;
