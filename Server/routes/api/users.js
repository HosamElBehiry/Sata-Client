const router = require("express").Router();
const user = require("../../controller/Users/users");
const userUpdCont = require("../../controller/Users/update");
const userFidCont = require("../../controller/Users/find");
const userDelCont = require("../../controller/Users/delete");
const auth = require("../../middleware/auth");
const { uploads } = require("../../shared/multer");

// for mobile
router.put(
  "/mobile/:id",
  auth.verifytoken,
  uploads.single("image"),
  userUpdCont.updateUserMobile
);

router.put(
  "/:id",
  auth.verifytoken,
  uploads.fields([
    { name: "taxcard_front", maxCount: 1 },
    { name: "taxcard_back", maxCount: 1 },
    { name: "commercialRecord", maxCount: 1 },
    { name: "licence_front", maxCount: 1 },
    { name: "licence_back", maxCount: 1 },
    { name: "licenceCar_front", maxCount: 1 },
    { name: "licenceCar_back", maxCount: 1 },
    { name: "drugAnalysis", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    if (req.user.roles[0] === 1 || req.user._id === req.params.id) {
      userUpdCont.updateByAdmin(req, res);
    }
  }
);

// مستخدمها فى ارسال الاشعارات فقط
router.get("/", auth.verifyTokenAndAdmin, userFidCont.findAll);

// الحته دى مستخدمها فى انه يعمل لكذا يوزر سوفت ديليت
router.delete("/many-users", auth.verifyTokenAndAdmin, userDelCont.deleteMany);

router.delete("/:id", auth.verifyTokenAndAdmin, userDelCont.deleteById);

router.get("/online/:role", auth.verifytoken, user.findOnlineUsers);

router.get("/news/:days/:role", auth.verifyTokenAndAdmin, userFidCont.getNews);

router.get(
  "/not-signed-in/:days/:role",
  auth.verifyTokenAndAdmin,
  userFidCont.notSignedByDays
);

router.get("/blocked/:role", auth.verifyTokenAndAdmin, userFidCont.findBlocked);

router.get("/findByRole/:role", auth.verifytoken, user.findByRole);

router.get("/me", auth.verifytoken, async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

router.get("/getUserById/:id", auth.verifytoken, userFidCont.findById);

module.exports = router;
