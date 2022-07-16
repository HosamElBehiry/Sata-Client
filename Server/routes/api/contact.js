const router = require("express").Router();
const auth = require("../../middleware/auth");
const addCont = require("../../controller/Contact/add");
const findCont = require("../../controller/Contact/find");
const updateCont = require("../../controller/Contact/update");
const deleteCont = require("../../controller/Contact/delete");

router.post("/", addCont.addNew);

router.get("/", auth.verifyTokenAndAdmin, findCont.findAll);

router.get("/:id", auth.verifyTokenAndAdmin, findCont.findById);

router.put("/:id", auth.verifyTokenAndAdmin, updateCont.updateById);

router.delete("/:id", auth.verifyTokenAndAdmin, deleteCont.deleteById);

module.exports = router;
