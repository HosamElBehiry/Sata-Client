const router = require("express").Router();
const cityAddCont = require("../../controller/City/add");
const cityFndCont = require("../../controller/City/find");
const cityUpdCont = require("../../controller/City/update");
const cityDltCont = require("../../controller/City/delete");
const { verifyTokenAndAdmin } = require("../../middleware/auth");

router.post("/", verifyTokenAndAdmin, cityAddCont.addNew);

router.put("/:id", verifyTokenAndAdmin, cityUpdCont.updateById);

// delete many cities ..
router.delete("/many-cities", verifyTokenAndAdmin, cityDltCont.deleteMany);

router.delete("/:id", verifyTokenAndAdmin, cityDltCont.deleteById);

router.get("/country/:id", cityFndCont.citiesRelated);

router.get("/", cityFndCont.findAll);

router.get("/:id", cityFndCont.findById);

module.exports = router;
