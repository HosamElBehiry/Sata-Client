const router = require("express").Router();
const auth = require("../../middleware/auth");
const order2 = require("../../controller/Orders/orders2");
const orderAddCont = require("../../controller/Orders/add");
const orderFndCont = require("../../controller/Orders/find");
const updateCont = require("../../controller/Orders/update");
const ordDelCont = require("../../controller/Orders/delete");
const req_owner = require("../../controller/shared/req_owner");

router.post("/", auth.verifytoken, orderAddCont.addOrder);

router.delete("/:id", auth.verifyTokenAndAdmin, ordDelCont.deleteById);

router.get("/", auth.verifytoken, order2.getAll);

// هنا انا بجيب من خلالها الفواتير المستحقه وهعملها اللى عدى عليها اسبوع لحد معرف هو عايز مده اد ايه
router.get(
  "/due-bills",
  auth.verifyTokenAndAdmin,
  orderFndCont.filterByDueBills
);

// بيعمل فلتر للاوردرات بناء على طريقه الدفع ومستخدمها فى النظام المالى
router.get(
  "/filt-payment",
  auth.verifyTokenAndAdmin,
  orderFndCont.filterByPayment
);

// الهدف منها انى اجيب الاوردرات اللى اتعملت ولسه متسلمتش عشان اعرضها فى النظام المالى
router.get(
  "/not-deliverd",
  auth.verifyTokenAndAdmin,
  orderFndCont.filterByNotPaid
);

router.get("/:id", auth.verifyTokenAndAdmin, orderFndCont.findById);

// بتجيب الاودرات بناء على النوع الحالى اللى هى فيه
router.get("/type/:type", auth.verifyAdminOrVendor, req_owner.ordOwner);

// get All Orders maded by special customer ..
router.get("/findBy/:customerId", auth.verifytoken, order2.getAllByCustomerId);

router.put("/:id", auth.verifyTokenAndAdmin, updateCont.updateById);

module.exports = router;
