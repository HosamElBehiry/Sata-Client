const router = require("express").Router();
const auth = require("../../middleware/auth");
const reqOwner = require("../../controller/shared/req_owner");
const retAddCont = require("../../controller/Returned/add");
const retUpdtCont = require("../../controller/Returned/update");
const retDeltCont = require("../../controller/Returned/delete");

router.post("/", auth.verifytoken, retAddCont.addNew);

router.get("/", auth.verifyAdminOrVendor, reqOwner.retPrdOwner);

router.put("/:id", auth.verifyAdminOrVendor, retUpdtCont.updateById);

router.delete("/:id", auth.verifyAdminOrVendor, retDeltCont.deleteById);

module.exports = router;
