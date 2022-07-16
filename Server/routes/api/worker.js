const router = require("express").Router();
const { verifyAdminOrVendor, verifytoken } = require("../../middleware/auth");
const work = require("../../controller/Worker/worker");
const workerFindCont = require("../../controller/Worker/find");
const workerUpdtCont = require("../../controller/Worker/update");
const workerDeltCont = require("../../controller/Worker/delete");
const det_owner = require("../../controller/shared/req_owner");

router.get("/", verifyAdminOrVendor, workerFindCont.findAll);

router.get("/:id", verifytoken, work.getWorkerById);

// مستخدمها فى الموبايل
// ببعتله الاى فى جدول العامل
router.put("/:id", verifyAdminOrVendor, workerUpdtCont.updateByVendor);

router.get("/user/:id", verifyAdminOrVendor, workerFindCont.findByUsrId);

// انا هنا عايز اخلى البائع يمسح كذا عامل خاص بيه فى الادمن بانل
router.delete(
  "/many-workers",
  verifyAdminOrVendor,
  workerDeltCont.deleteByVendor
);

router.delete("/:id", verifyAdminOrVendor, det_owner.workerOwner);

module.exports = router;
