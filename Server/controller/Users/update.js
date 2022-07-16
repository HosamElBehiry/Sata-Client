const Users = require("../../models/Users");
const bcrypt = require("bcrypt");
const notifCont = require("../Notifications/Notification");
const adminCont = require("../Admin/Admin");
const prodFindCont = require("../Products/find");
const userFndCont = require("./find");
const vendUpdCont = require("../Vendor/update");
const delvUpdCont = require("../Delivery/update");
const workUpdCont = require("../Worker/update");
const { dE, dSuc, dNotPermit } = require("../../shared/shared");

const updateNumberOfOrders = async (req, res) => {
  try {
    for (let i = 0; i < req.orderItems.length; i++) {
      const findUser = await Users.findOne({
        _id: req.orderItems[i].customer.toString(),
      });
      const updateUser = await Users.updateOne(
        { _id: req.orderItems[i].customer.toString() },
        {
          $push: { Orders: req.orderItems[i]._id.toString() },
          $set: { numberOfOrders: findUser.numberOfOrders + 1 },
        }
      );
    }
    res.status(200).json({ msg: "Updated Successfully" });
  } catch (error) {
    dE(res, error);
  }
};

// فى حاله لما المنتج يتضاف يروح يتضاف الاى دى فى جدول اليوزرات
const addNewProdId = async (req, res) => {
  try {
    const updateUser = await Users.findByIdAndUpdate(
      req.user.roles[0] === 2 ? req.user._id : req.body.vendor,
      {
        $push: { Products: req.newProduct._id },
      }
    );
    if (req.user.roles[0] === 2) {
      req.description = {
        en: `New Product has been Added by ${req.user.fullname}`,
        ar: `${req.user.fullname} قد تم اضافه منتج جديد بواسطه`,
      };
      req.reciever = req.user._id;
      req.notificationToAdmin = await notifCont.notify(req, res);
      adminCont.sendNotification(req, res);
    } else {
      prodFindCont.findById(req, res);
    }
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// هنا الادمن هيحاول يعدل بيانات يوزر معين
const updateByAdmin = async (req, res) => {
  try {
    let updPass;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updPass = await bcrypt.hash(req.body.password, salt);
    }
    const oldData = await Users.findById(req.params.id);
    const updUser = await Users.findByIdAndUpdate(req.params.id, {
      $set: {
        image: req.files.image ? req.files.image[0].path : req.body.image,
        fullname: req.body.fullname,
        email: req.body.email,
        password: req.body.password === "" ? oldData.password : updPass,
        role: req.body.role,
        telephone: req.body.telephone,
        mobile: req.body.mobile,
        status: req.body.status,
        isDeleted: req.body.isDeleted,
      },
    });
    if (req.body.role === "vendor") {
      vendUpdCont.updateByAdmin(req, res);
    } else if (req.body.role === "delivery") {
      delvUpdCont.updateByUsrId(req, res);
    } else if (req.body.role === "worker") {
      workUpdCont.updateByUsrId(req, res);
    } else {
      userFndCont.findById(req, res);
    }
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// دى عشان الموبايل يقدر يعمل تعديل على البروفايل بتاعه
const updateUserMobile = async (req, res) => {
  try {
    let flag = false;
    let updPass;
    const usrData = await Users.findById(req.user._id);
    const { fullname, telephone, mobile, newPassword, oldPassword } = req.body;
    if (newPassword) {
      const checkPassword = await bcrypt.compare(oldPassword, usrData.password);
      if (checkPassword) {
        const salt = await bcrypt.genSalt(10);
        updPass = await bcrypt.hash(newPassword, salt);
      } else {
        flag = !flag;
        dNotPermit(res, req.t("NOT.PERMITTED"));
      }
    }
    if (!flag) {
      const updUser = await Users.findByIdAndUpdate(req.user._id, {
        $set: {
          fullname: fullname ? fullname : usrData.fullname,
          telephone: telephone ? telephone : usrData.telephone,
          mobile: mobile ? mobile : usrData.mobile,
          image: req.file ? req.file.path : usrData.image,
          password: newPassword ? updPass : usrData.password,
        },
      });
      userFndCont.findById(req, res);
    }
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = {
  updateNumberOfOrders,
  addNewProdId,
  updateByAdmin,
  updateUserMobile,
};
