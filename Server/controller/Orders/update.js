const Orders = require("../../models/Orders");
const findCont = require("./find");
const notification = require("../Notifications/Notification");
const notifyAdmin = require("../Admin/Admin");
const { dE } = require("../../shared/shared");
const OrderItem = require("../../models/OrderItem");

const updateById = async (req, res) => {
  try {
    const updateOrder = await Orders.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    findCont.findById(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// عشان لما يوزر يعمل تقييم على الاوردر يروح فى جدوا الاوردرات وضيف تقييم
const updateRate = async (req, res) => {
  try {
    const order = await Orders.findById(req.body.order);
    const upd = await Orders.findByIdAndUpdate(req.body.order, {
      $push: { "rate.all": req.body.rate },
      $set: {
        "rate.value":
          order.rate.all.length > 0
            ? (order.rate.all.reduce((prev, curr) => prev + curr) +
                req.body.rate) /
              (order.rate.all.length + 1)
            : req.body.rate,
      },
    });
    req.description = {
      en: `${req.user.fullname} gave ${req.body.rate} rates on his order`,
      ar: `قد تم اضافه تقييم ${req.body.rate} بواسطه ${req.user.fullname} على الطلب الخاص به`,
    };
    req.reciever = req.user._id;
    req.notificationToAdmin = await notification.notify(req, res);
    notifyAdmin.sendNotification(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// الفانشكن دى كل شغلتها انها تشوف لو كل الاوردر ايتم بقت الحاله
// بتاعتهم مؤكده يخلى الاوردر اللى شايلهم الحاله بتاعته مؤكده ونفس الكلام لو الحاله بتاعته تم توصيلها وهكذا
const updateOrderState = async (req, res) => {
  try {
    const relatedOrdItms = await OrderItem.find({ order: req.orderItem.order });
    let flag = false;
    for (let i = 1; i < relatedOrdItms.length; i++) {
      if (relatedOrdItms[i].status !== relatedOrdItms[i - 1].status) {
        flag = !flag;
        break;
      }
    }
    !flag &&
      (await Orders.findByIdAndUpdate(req.orderItem.order.toString(), {
        $set: {
          type: req.body.status,
          is_paid: req.body.status === "Deliverd" ? true : false,
        },
      }));
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { updateById, updateRate, updateOrderState };
