const OrderItem = require("../../models/OrderItem");
const deliv = require("../Delivery/delivery");
const prod = require("../Products/product");
const delivNotifCont = require("../Delivery/notification");
const ordUpdCont = require("../Orders/update");
const Users = require("../../models/Users");
const notification = require("../Notifications/Notification");
const admin = require("../Admin/Admin");
const vendor = require("../Vendor/sendNotification");
const { dE, dNotPermit, dSuc } = require("../../shared/shared");

const findAll = async (req, res) => {
  try {
    if (req.user.roles[0] === 1) {
      // admin tries to find all Order Items
      const allOrderItems = await OrderItem.find();
      res.status(200).json(allOrderItems);
    } else if (req.user.roles[0] === 2) {
      // vendor tries to find his Order Items ;
      const vendorInfo = await Users.findById(req.user._id);
      const specialOrderItems = await OrderItem.find({
        product: { $in: vendorInfo.Products },
        isDeleted: req.query.isDeleted,
      })
        .populate("customer", "fullname")
        .populate("product", "title image price")
        .populate("order", "shipping_cost fullname is_paid phone address");
      dSuc(res, specialOrderItems);
    }
  } catch (error) {
    dE(res, error);
  }
};

const update = async (req, res, next) => {
  try {
    const vendor = await Users.findById(req.user._id);
    req.orderItem = await OrderItem.findById(req.params.id);
    if (vendor.Products.indexOf(req.orderItem.product.toString()) === -1) {
      dNotPermit(res, req.t("NOT.PERMITTED"));
    } else {
      const updatedOrderItem = await OrderItem.findByIdAndUpdate(
        req.params.id,
        { $set: req.body }
      );
      if (
        req.body.status === "Deliverd" &&
        req.orderItem.status !== "Deliverd"
      ) {
        req.isOrderDeliverdNow = true;
        req.body.delivery ? deliv.update(req, res) : prod.update(req, res);
      } else if (req.body.delivery) {
        delivNotifCont.sendNotification(req, res, next);
      } else {
        ordUpdCont.updateOrderState(req, res);
        dSuc(res, req.t("DISPLAY.SUCCESS"));
      }
    }
  } catch (error) {
    dE(res, error);
  }
};

const orderItemDelivery = async (req, res) => {
  try {
    const orderItems = await OrderItem.find({
      delivery: req.params.id,
    })
      .populate("customer")
      .populate("product")
      .populate("order");
    res.status(200).json(orderItems);
  } catch (error) {
    dE(res, error);
  }
};

// بعد متتم عمليه اضافه الاوردر بنجاح يروح يضيف الاوردر ايتم
const addNew = async (req, res) => {
  try {
    const ordItms = await OrderItem.insertMany(req.body.orderItems);
    const filtOrdItms = ordItms.map((o) => o._id.toString());
    const updOrdItm = await OrderItem.updateMany(
      { _id: { $in: filtOrdItms } },
      {
        $set: { order: req.newOrder._id.toString() },
      }
    );
    // انا هنا بحاول انى ابعت اشعار للبائع
    req.body.orderItems.forEach(async (element) => {
      let vend = await Users.findOne({
        Products: element.product,
      });
      req.reciever = vend._id;
      req.description = {
        en: `${req.user.fullname} bought ${element.quantity} of your product`,
        ar: `${req.user.fullname} بواسطه ${element.quantity} قد تم طلب شراء بكميه `,
      };
      req.notificationToVendor = await notification.notify(req, res);
      vendor.sendNotification(req, res);
    });
    // بعد مكل بائع يستلم رسالته..  الادمن المفروض يعرف
    req.reciever = req.user._id;
    req.description = {
      en: `${req.user.fullname} make an order `,
      ar: `${req.user.fullname} قد تم طلب شراء بواسطه `,
    };
    req.notificationToAdmin = await notification.notify(req, res);
    admin.sendNotification(req, res);
  } catch (error) {
    dE(res, error);
  }
};

const findByID = async (req, res) => {
  try {
    const orderItem = await OrderItem.findOne({ _id: req.params.id })
      .populate("order")
      .populate("customer")
      .populate("product");
    res.status(200).json(orderItem);
  } catch (error) {
    dE(res, error);
  }
};

// مستخدمه للموبايل
const assignedOrderItems = async (req, res) => {
  try {
    const orderItems = await OrderItem.find({
      status:
        req.url !== "/done-orders" ? { $ne: "Deliverd" } : { $eq: "Deliverd" },
      delivery: req.deliveryBoy._id.toString(),
    })
      .populate(
        "order",
        "is_paid price shipping_cost address longitude latitude fullname phone"
      )
      .populate("product")
      .populate("customer", "fullname");
    dSuc(res, orderItems);
  } catch (error) {
    dE(res, error);
  }
};

// عشان لما ييجى يمسح يشوف كل الاوردر اتيمز اللى اتعملت ويتاكد ان كلها معمولها سوفت ديليت
const findByProdId = async (req, res) => {
  try {
    return await (
      await OrderItem.find({ product: req.params.id })
    ).filter((o) => o.isDeleted === false);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = {
  addNew,
  findAll,
  update,
  orderItemDelivery,
  findByID,
  assignedOrderItems,
  findByProdId,
};
