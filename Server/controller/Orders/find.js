const Orders = require("../../models/Orders");
const moment = require("moment");
const { dE, dSuc } = require("../../shared/shared");

const findById = async (req, res) => {
  try {
    const orderId = await Orders.findById(
      req.newOrder ? req.newOrder._id : req.params.id
    ).populate("customer", "fullname");
    dSuc(res, orderId);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// ببعت النوع اذا كان تحت الطلب او تم الموافقه عليه اوغيره
const findByType = async (req, res) => {
  try {
    const ordType = await Orders.find({ type: req.params.type })
      .select("customer createdAt address is_paid type")
      .populate("customer", "fullname");
    dSuc(res, ordType);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// بتجيب الاوردرات اللى اتوصلت خلاص والهدف منها انى اشوف نوع التوصيل ايه اذا كان بالمحفظه ولا بالفلوس
const filterByPayment = async (req, res) => {
  try {
    const delivOrd = await Orders.find(
      { type: "Deliverd" },
      { payment_type: 1, price: 1 }
    );
    let price_with_money = 0;
    let price_with_bocket = 0;
    delivOrd.forEach((order) => {
      if (order.payment_type.with_money) {
        price_with_money += order.price;
      } else {
        price_with_bocket += order.price;
      }
    });
    dSuc(res, { price_with_money, price_with_bocket });
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// والهدف منها انى اجيب الطلبات اللى لسه متوصلتش عشان اعرضها فى النظام المالى
const filterByNotPaid = async (req, res) => {
  try {
    const notPaidOrd = await Orders.aggregate([
      {
        $match: { is_paid: false },
      },
      {
        $group: {
          _id: "",
          price: { $sum: "$price" },
        },
      },
      {
        $project: {
          _id: 0,
          price: "$price",
        },
      },
    ]);
    dSuc(res, notPaidOrd);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// الهدف منها انى اجيب الفواتير المستحقه اللى مطلوبه فى النظام المالى
// انا هنا عاملها ان الفواتير المستحقه يبقى اللى عدى عليها اسبوع
const filterByDueBills = async (req, res) => {
  try {
    const dueBills = await Orders.find({
      createdAt: {
        $gte: moment().subtract(7, "day").startOf("day"),
        $lte: moment().subtract(7, "day").endOf("day"),
      },
    });
    let sum = 0;
    dueBills.forEach((due) => {
      sum += due.price;
    });
    dSuc(res, sum);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = {
  findById,
  findByType,
  filterByPayment,
  filterByNotPaid,
  filterByDueBills,
};
