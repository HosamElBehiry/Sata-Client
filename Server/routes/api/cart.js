const router = require("express").Router();
const cartAddCont = require("../../controller/Cart/add");
const cartFndCont = require("../../controller/Cart/find");
const cartUpdCont = require("../../controller/Cart/update");
const cartDltCont = require("../../controller/Cart/delete");
const auth = require("../../middleware/auth");

router.post("/", auth.verifytoken, cartAddCont.checkCart);

// الهدف منها ان لما اليوزر يعمل لوج ان يعرض اللى فى العربه بتاعته
// يعتمد على التوكن بتاعت اليوزر
router.get("/user", auth.verifytoken, cartFndCont.findByUsrId);

// دى عشان اليوزر يقدر يعدل الكميه بتاعت كل منتج فى العربه بتاعته
router.put("/user", auth.verifytoken, cartUpdCont.usrUpdCart);

// ده معموله للموبايل عشان تعديل العربه
router.put("/mobile", auth.verifytoken, cartUpdCont.updateForMobile);

// الهدف منها انى اجيب المنتجات اللى جوه العربه بتاعت اليوزر
// بتعتمد على التوكن بتاعت اليوزر اللى داخل
router.get("/prod-user", auth.verifytoken, cartFndCont.getProdCart);

// دى بستخدمها عشان امسح حاجه من العربه
router.delete("/user", auth.verifytoken, cartDltCont.deleteFromCart);

// بتشيل كل اللى فى العربه لما اليوزر يعمل اوردر
// مستخدمه لحد دلوقتى فى الموبايل
router.delete("/", auth.verifytoken, cartDltCont.deleteCart);

module.exports = router;
