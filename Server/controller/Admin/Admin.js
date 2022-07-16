const Users = require("../../models/Users");
const prodFindCont = require("../Products/find");
const vendorFndCont = require("../Vendor/find");
const delivrFndCont = require("../Delivery/find");
const workerFndCont = require("../Worker/find");
const paymentAddCont = require("../Payment/AuthenticationRequest");
const { dE, dCre, dSuc } = require("../../shared/shared");

const sendNotification = async (req, res) => {
  try {
    const admins = await Users.updateMany(
      { role: "admin" },
      {
        $push: {
          Notifications: {
            $each: [req.notificationToAdmin._id],
            $position: 0,
          },
        },
      }
    );
    if (req.newProduct) {
      prodFindCont.findById(req, res);
    } else if (req.newOrder) {
      paymentAddCont.getToken(req, res);
    } else {
      dCre(res, req.t("DISPLAY.SUCCESS"));
    }
  } catch (error) {
    dE(res, error);
  }
};

const findOnlineUsers = async (req, res) => {
  try {
    const onlineUsers = await Users.find({
      $and: [{ online: true }, { role: req.params.role }, { isDeleted: false }],
    }).select("image fullname createdAt email status");
    if (req.params.role === "user") {
      dSuc(res, onlineUsers);
    } else if (req.params.role === "vendor") {
      req.info = onlineUsers;
      vendorFndCont.vendorInfo(req, res);
    } else if (req.params.role === "delivery") {
      req.info = onlineUsers;
      delivrFndCont.deliveryInfo(req, res);
    } else if (req.params.role === "worker") {
      req.info = onlineUsers;
      workerFndCont.workerInfo(req, res);
    }
  } catch (error) {
    dE(res, error);
  }
};

const findByRole = async (req, res) => {
  try {
    //  اول الحته اللى هى بتاعت الرول بتاعت الشرط دى عشان ممكن الفانكشن دى
    // تتنفذ بعد فانكشن ملتى ديليت اللى جايه من ملف ديليت الى فى فولدر اليوزر
    //  انا مستخدم الحته بتاعت الشرط فى اليند بتاع المسح دى عشان ممكن
    // اجيب الناس حسب الرول اللى معمولهم سوفت ديليت
    const userRoles = await Users.find({
      role: req.usrData ? req.usrData.role : req.params.role,
      isDeleted: req.query.isDeleted,
    }).select("image fullname createdAt email status");
    dSuc(res, userRoles);
  } catch (error) {
    dE(res, error);
  }
};

module.exports = { sendNotification, findOnlineUsers, findByRole };
