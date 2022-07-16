const Delivery = require("../../models/Delivery");
const sharedNotification = require("../Rate/sharedNotification");
const prod = require("../Products/product");
const { dE } = require("../../shared/shared");
const orderItem = require("../Orders/orderItems");
const OrderItems = require("../../models/OrderItem");
const Users = require("../../models/Users");

const sendNotification = async (req, res, next) => {
  try {
    const find = await Delivery.findOne({ _id: req.body.delivery });
    req.find = find;
    req.message = { en: "You have a new Order", ar: "لديك طلب جديد" };
    sharedNotification.sharedNotification(req, res);
  } catch (error) {
    dE(res, error);
  }
};

const update = async (req, res) => {
  try {
    const updatedDelivery = await Delivery.findByIdAndUpdate(
      req.orderItem.delivery,
      {
        $inc: {
          numberOfDeliverdOrders: 1,
        },
      }
    );
    prod.update(req, res);
  } catch (error) {
    dE(res, error);
  }
};

const findByRole = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ inOrder: false }).populate("user");
    res.status(200).json(deliveries);
  } catch (error) {
    dE(res, error);
  }
};

const assignedOrders = async (req, res) => {
  try {
    req.deliveryBoy = await Delivery.findOne({ user: req.user._id });
    orderItem.assignedOrderItems(req, res);
  } catch (error) {
    dE(res, error);
  }
};

// دى يغير حالته من اونلاين لاوفلاين للموبايل عشان ممكن يكون فاتح الابليكيشن ومش عايز يشتغل او واخد اجازه
const changeOnlineState = async (req, res) => {
  try {
    const foundUser = await Users.findOne({ _id: req.user._id });
    const updateDeliv = await Users.updateOne(
      { _id: req.user._id },
      { $set: { online: !foundUser.online } }
    );
    const delivBoy = await Delivery.findOne({ user: req.user._id });
    res
      .status(200)
      .json({ online: !foundUser.online, inOrder: delivBoy.inOrder });
  } catch (error) {
    dE(res, error);
  }
};

// دى بتقولى الحاله بتاعته اذا كان فى اوردر او فاضى
const getCurrentState = async (req, res) => {
  try {
    const deliveryBoy = await Delivery.findOne({ user: req.user._id });
    res
      .status(200)
      .json({ inOrder: deliveryBoy.inOrder, isOnline: req.user.online });
  } catch (error) {
    dE(res, error);
  }
};

// دى بتاعت كل ميتجرك يتغير الموقع بتاعه حسب هو فين
const changeLocation = async (req, res) => {
  try {
    const delivBoy = await Delivery.updateOne({ user: req.user._id }, [
      { $set: { "location.longitude": req.body.longitude } },
      { $set: { "location.latitude": req.body.latitude } },
    ]);
    res.status(200).json({ msg: "Location changed" });
  } catch (error) {
    dE(res, error);
  }
};

// هنا المفروض انه يقدؤ يغير بس الاوردات اللى جاتله ووافق عليها انه يوصلها من confirmed -> onDelivery
// ممكن بردو يغير الاوردات من onDelivery -> Deliverd
const updateOrderItems = async (req, res) => {
  try {
    const { status } = req.body;
    const deliveryBoy = await Delivery.findOne({ user: req.user._id });
    const orders = await OrderItems.find({
      _id: { $in: req.body.orderItems },
    });
    const flag = true;
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].delivery.toString() !== deliveryBoy._id.toString()) {
        flag = !flag;
        break;
      }
    }
    if (!flag) {
      res.status(403).send("You are not permitted");
    }
    const updateOrderItem = await OrderItems.updateMany(
      { _id: { $in: req.body.orderItems } },
      { $set: { status } }
    );

    if (status === "onDelivery") {
      const updateDeliveryBoy = await Delivery.updateOne(
        { user: req.user._id },
        { $set: { inOrder: true } }
      );
      res.status(200).json({ msg: "Changed from confirmed to onDelivery" });
    } else {
      const orderItemsNotDeliverd = await OrderItems.find({
        $and: [
          { delivery: deliveryBoy._id.toString() },
          { status: { $ne: "Deliverd" } },
        ],
      });
      if (orderItemsNotDeliverd.length === 0) {
        const updateDeliveryState = await Delivery.updateOne(
          { user: req.user._id },
          { $set: { inOrder: false } }
        );
      }
      // order has been deliverd by this delivery
      const updateDeliv = await Delivery.updateOne(
        { user: req.user._id },
        {
          $set: {
            numberOfDeliverdOrders:
              deliveryBoy.numberOfDeliverdOrders + req.body.orderItems.length,
          },
        }
      );
      req.orderItems = orders;
      prod.updateByDelivery(req, res);
    }
  } catch (error) {
    dE(res, error);
  }
};

module.exports = {
  sendNotification,
  update,
  findByRole,
  assignedOrders,
  changeOnlineState,
  getCurrentState,
  changeLocation,
  updateOrderItems,
};
