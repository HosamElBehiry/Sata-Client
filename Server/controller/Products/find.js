const Products = require("../../models/Products");
const { dE, dSuc } = require("../../shared/shared");

const findById = async (req, res) => {
  try {
    const prodId = await Products.findById(
      req.newProduct ? req.newProduct._id.toString() : req.params.id
    )
      .select(
        "title rate image categoryId subCategory brand price isApproved createdAt user"
      )
      .populate("categoryId", "title")
      .populate("subCategory", "title")
      .populate("brand", "title");
    dSuc(res, prodId);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// دى بتجيب اكتر منتج اتباع
const mostBought = async (req, res) => {
  try {
    const mostBt = await Products.find(
      req.user.roles[0] === 2 ? { user: req.user._id } : {}
    )
      .sort({ bought: -1 })
      .limit(1)
      .select("price bought title image");
    if (req.VendReports) {
      req.allReports.push({ mostBought: mostBt[0] });
      dSuc(res, req.allReports);
    } else {
      dSuc(res, mostBt[0]);
    }
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// lowest products
const getLowest = async (req, res) => {
  try {
    // معناها هات اللى الاستور اقل من او يساوى اللو
    const minProducts = await Products.find({
      $expr: { $lte: ["$store", "$low"] },
      isDeleted: false,
    })
      .select(
        "title rate image categoryId subCategory brand price isApproved createdAt user"
      )
      .populate("categoryId", "title")
      .populate("subCategory", "title")
      .populate("brand", "title");
    dSuc(res, minProducts);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// اكتر منتج اتشاف
const mostVisited = async (req, res) => {
  try {
    const mostBt = await Products.find(
      req.user.roles[0] === 2 ? { user: req.user._id } : {}
    )
      .sort({ "visitedBy.length": -1 })
      .select("visitedBy title image");
    let result = mostBt[0];
    for (let i = 1; i < mostBt.length; i++) {
      if (mostBt[i].visitedBy.length > result.visitedBy.length) {
        result = mostBt[i];
      }
    }
    if (req.VendReports) {
      req.allReports.push({ mostVisited: result });
      mostBought(req, res);
    } else {
      dSuc(res, result);
    }
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

const findAll = async (req, res) => {
  try {
    const products = await Products.find({ isDeleted: req.query.isDeleted })
      .select(
        "title rate image categoryId subCategory brand price isApproved createdAt user"
      )
      .populate("categoryId", "title")
      .populate("subCategory", "title")
      .populate("brand", "title");
    dSuc(res, products);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// دى بتحيب كل المنتجات اللى ليها نفس العلامه التجاريه وبتاخد الاى دى بتاع الامه التجاريه
const filterByBrand = async (req, res) => {
  try {
    const filtProd = await Products.find({
      isDeleted: false,
      brand: req.params.id,
    })
      .select(
        "title rate image categoryId subCategory brand price isApproved createdAt user"
      )
      .populate("categoryId", "title")
      .populate("subCategory", "title")
      .populate("brand", "title");
    dSuc(res, filtProd);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// بيجيب كل المنتجات اللى ليها نفس الكاتيجورى اى دى او نفس الصب كاتيجورى اى دى
const filterByCatSub = async (req, res) => {
  try {
    const filtCatSub = await Products.find({
      isDeleted: false,
      $or: [{ categoryId: req.params.id }, { subCategory: req.params.id }],
    })
      .select(
        "title rate image categoryId subCategory brand price isApproved createdAt user"
      )
      .populate("categoryId", "title")
      .populate("subCategory", "title")
      .populate("brand", "title");
    dSuc(res, filtCatSub);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// الفرق بينها وبين اللى فوق هى انها بتجيب اعلى 5 اتباعو
const mostBoughtProducts = async (req, res) => {
  try {
    const boughtProducts = await Products.find({ isDeleted: false })
      .sort({ bough: -1 })
      .limit(5)
      .select(
        "title rate image categoryId subCategory brand price isApproved createdAt user store bought"
      )
      .populate("categoryId", "title")
      .populate("subCategory", "title")
      .populate("brand", "title");
    dSuc(res, boughtProducts);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// بديها جزء من اسم الكاتيجورى او الصب كاتيجورى او البراند او الاسم وتجيب المنتجات
const allPossibleSearch = async (req, res) => {
  try {
    const products = await Products.aggregate([
      {
        $lookup: {
          from: "categories",
          foreignField: "_id",
          localField: "categoryId",
          as: "prodCategory",
        },
      },
      {
        $lookup: {
          from: "subcategories",
          foreignField: "_id",
          localField: "subCategory",
          as: "prodSubCategories",
        },
      },
      {
        $lookup: {
          from: "brands",
          foreignField: "_id",
          localField: "brand",
          as: "prodBrands",
        },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "user",
          as: "Vendor",
        },
      },
      {
        $match: {
          isDeleted: false,
          $or: [
            !!req.query.title && {
              "title.en": {
                $regex: req.query.title,
                $options: "i",
              },
            },
            !!req.query.title && {
              "title.ar": {
                $regex: req.query.title,
                $options: "i",
              },
            },
            !!req.query.category && {
              "prodCategory.title.en": {
                $regex: req.query.category,
                $options: "i",
              },
            },
            !!req.query.category && {
              "prodCategory.title.ar": {
                $regex: req.query.category,
                $options: "i",
              },
            },
            !!req.query.subCategory && {
              "prodSubCategories.title.en": {
                $regex: req.query.subCategory,
                $options: "i",
              },
            },
            !!req.query.subCategory && {
              "prodSubCategories.title.ar": {
                $regex: req.query.subCategory,
                $options: "i",
              },
            },
            !!req.query.brand && {
              "prodBrands.title.en": {
                $regex: req.query.brand,
                $options: "i",
              },
            },
            !!req.query.brand && {
              "prodBrands.title.ar": {
                $regex: req.query.brand,
                $options: "i",
              },
            },
            !!req.query.minPrice &&
              !!req.query.maxPrice && {
                price: {
                  $gte: Number(req.query.minPrice),
                  $lte: Number(req.query.maxPrice),
                },
              },
          ],
        },
      },
      {
        $project: {
          title: 1,
          image: 1,
          price: 1,
          createdAt: 1,
          "prodCategory.title": 1,
          "prodBrands.title": 1,
          "Vendor.fullname": 1,
        },
      },
    ]);
    dSuc(res, products);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// بتجيب المنتجات اللى هى واخده تقييم عالى
const mostRated = async (req, res) => {
  try {
    const rated = await Products.find(
      {
        isDeleted: false,
        "rate.value": { $ne: 0 },
      },
      { image: 1, "rate.value": 1, title: 1, price: 1 }
    );
    dSuc(res, rated);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// منتجات ليها نفس الكاتيجورى اى دى او نفس الصب
// كاتيجورى اى دى او نفس البراند اى دى
// مستخدمها فى السايت فى الحته اللى تحت تفاصيل المنتج على طول

const relatedProducts = async (req, res) => {
  try {
    const prodData = await Products.findById(req.params.id);
    const related = await Products.find(
      {
        $or: [
          { categoryId: prodData.categoryId },
          { subCategory: prodData.subCategory },
          { brand: prodData.brand },
        ],
      },
      { image: 1, title: 1, "rate.value": 1, price: 1 }
    );
    dSuc(res, related);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// بتجيب اخر 6منتجات اتضافو ومستخدمها فى السايت
const last6Products = async (req, res) => {
  try {
    const last = await Products.find(
      { isDeleted: false },
      { image: 1, price: 1, "rate.value": 1, title: 1 }
    )
      .sort({ createdAt: -1 })
      .limit(6);
    dSuc(res, last);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = {
  findById,
  mostBought,
  mostBoughtProducts,
  mostVisited,
  findAll,
  getLowest,
  filterByBrand,
  filterByCatSub,
  allPossibleSearch,
  mostRated,
  relatedProducts,
  last6Products,
};
