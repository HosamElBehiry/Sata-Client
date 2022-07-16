const Products = require("../../models/Products");
const vend = require("../Vendor/Vendor");
const address = require("address");
const ProductGallery = require("../../models/ProductGallery");
const { dE, dSuc } = require("../../shared/shared");

// دى كده المنتجات اللى عدى عليها اسبوع
const getNews = async (req, res) => {
  try {
    const news = await Products.find(
      {
        isDeleted: false,
        createdAt: {
          $gte: new Date(
            new Date().getTime() - 1000 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      },
      { image: 1, title: 1, "rate.value": 1, price: 1 }
    );
    dSuc(res, news);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

const getProductByID = async (req, res) => {
  // I made it for mobile
  try {
    const productId = await Products.findOne({ _id: req.params.id })
      .populate("brand", "title")
      .populate("subCategory", "title")
      .populate("user", "fullname")
      .populate("categoryId", "title")
      .select("-onsale -sale -status -isApproved -isDeleted");
    address.mac(async (err, MAC) => {
      if (err) {
        dE(res, err);
      } else {
        if (productId.visitedBy.indexOf(MAC) === -1) {
          const updateView = await Products.updateOne(
            { _id: req.params.id },
            { $push: { visitedBy: MAC } }
          );
        }
      }
    });
    const prodGal = await ProductGallery.find({ product: req.params.id });
    dSuc(res, { product: productId, albums: prodGal });
  } catch (error) {
    dE(res, error);
  }
};

// الاى بى اى ديه الغرض منها ان البائع لما يدخل الاكونت بتاعه يقدر يشوف
// المنتجات الخاصه بيه هو بس عشان يقدر يعدل ويمسح فيها زى مهو عايز
const getVendorProducts = async (req, res) => {
  try {
    const vendProd = await Products.find({
      user: req.user._id.toString(),
      isDeleted: false,
    })
      .populate("categoryId")
      .populate("brand")
      .populate("subCategory");
    res.status(200).json(vendProd);
  } catch (error) {
    dE(res, error);
  }
};

const update = async (req, res) => {
  try {
    const productData = await Products.findById(req.orderItem.product);
    const updatedProductData = await Products.findByIdAndUpdate(
      req.orderItem.product,
      {
        $inc: {
          bought: req.orderItem.quantity,
          store: -req.orderItem.quantity,
        },
      }
    );
    req.productInfo = productData;
    vend.update(req, res);
  } catch (error) {
    dE(res, error);
  }
};

const updateByDelivery = async (req, res) => {
  try {
    const productInfo = [];
    for (let i = 0; i < req.orderItems.length; i++) {
      const findProd = await Products.findOne({
        _id: req.orderItems[i].product.toString(),
      });
      const updateProd = await Products.updateOne(
        { _id: req.orderItems[i].product.toString() },
        {
          $set: {
            bought: findProd.bought + req.orderItems[i].quantity,
            store: findProd.store - req.orderItems[i].quantity,
          },
        }
      );
      productInfo.push(findProd);
    }
    req.productInfo = productInfo;
    vend.updateByDelivery(req, res);
  } catch (error) {
    dE(res, error);
  }
};

module.exports = {
  getNews,
  getProductByID,
  getVendorProducts,
  update,
  updateByDelivery,
};
