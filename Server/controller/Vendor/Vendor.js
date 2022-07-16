const Users = require("../../models/Users");
const userUpdateController = require("../Users/update");
const Vendor = require("../../models/Vendor");
const sharedNotification = require("../Rate/sharedNotification");
const ordUpdCont = require("../Orders/update");
const Bill = require("../../models/Bill");
const { dE, dSuc } = require("../../shared/shared");

const getAll = async (req, res) => {
  try {
    // انا هنا عامل الشرط ده عشان الفانكشن دى كمان بتجيب كل الناس اللى معمولها سوفت ديليت
    const allVendors = await Vendor.find({
      isDeleted: req.query.isDeleted ? true : false,
    })
      .select("rate user createdAt ")
      .populate("user", "image fullname email status");
    dSuc(res, allVendors);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

const sendNotification = async (req, res, next) => {
  try {
    if (req.body.vendor) {
      req.find = await Vendor.findById(req.body.vendor);
      sharedNotification.sharedNotification(req, res, next);
    }
  } catch (error) {
    dE(res, error);
  }
};

const update = async (req, res) => {
  try {
    const vendorData = await Users.findOne({
      Products: req.orderItem.product,
    });
    const newBill = await new Bill({
      money: req.productInfo.price * req.orderItem.quantity,
      deliverdToVendor: true,
      vendor: vendorData._id,
      order: req.orderItem.order,
      ordItm: req.orderItem._id,
    }).save();
    const updateVendorTable = await Vendor.updateOne(
      { user: vendorData._id },
      {
        $inc: {
          numberOfDeliverdOrders: 1,
        },
        $push: {
          Profits: newBill._id,
        },
      }
    );
    ordUpdCont.updateOrderState(req, res);
    dSuc(res, req.t("DISPLAY.SUCCESS"));
  } catch (error) {
    dE(res, error);
  }
};

const updateByDelivery = async (req, res) => {
  try {
    for (let i = 0; i < req.orderItems.length; i++) {
      const productOwner = await Users.findOne({
        Products: req.orderItems[i].product.toString(),
      });
      const vendorTable = await Vendor.findOne({
        user: productOwner._id.toString(),
      });
      const updateVendorTable = await Vendor.updateOne(
        {
          user: productOwner._id.toString(),
        },
        {
          $set: {
            numberOfDeliverdOrders: vendorTable.numberOfDeliverdOrders + 1,
            Net:
              vendorTable.Net +
              req.productInfo[i].price * req.orderItems[i].quantity,
          },
        }
      );
    }
    userUpdateController.updateNumberOfOrders(req, res);
  } catch (error) {
    dE(res, error);
  }
};

module.exports = {
  getAll,
  sendNotification,
  update,
  updateByDelivery,
};
