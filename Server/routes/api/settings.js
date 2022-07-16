const router = require("express").Router();
const settingAddCont = require("../../controller/Settings/add");
const settingFndCont = require("../../controller/Settings/find");
const settingUpdCont = require("../../controller/Settings/update");
const { verifyTokenAndAdmin } = require("../../middleware/auth");
const { uploads } = require("../../shared/multer");

router.put(
  "/:id",
  verifyTokenAndAdmin,
  uploads.fields([
    { name: "logo", maxCount: 1 },
    { name: "favIcon", maxCount: 1 },
  ]),
  settingUpdCont.updateById
);

router.post(
  "/",
  verifyTokenAndAdmin,
  uploads.fields([
    { name: "logo", maxCount: 1 },
    { name: "favIcon", maxCount: 1 },
  ]),
  settingAddCont.addNew
);

//Router api/settings
router.get("/:id", settingFndCont.findById);

module.exports = router;
