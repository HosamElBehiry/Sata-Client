const Products = require("../../models/Products");
const prodFindCont = require("./find");
const ProductGallery = require("../../models/ProductGallery");
const { dE, dSuc } = require("../../shared/shared");

const updateById = async (req, res) => {
  try {
    const color = req.body.color
      .toString()
      .split(",")
      .map((col) => col.trim());
    const size = req.body.size
      .toString()
      .split(",")
      .map((col) => col.trim());
    req.imgIndx = 0;
    const updProdId = await Products.updateOne(
      { _id: req.params.id },
      {
        $set: {
          "title.en": req.body.title_en,
          "title.ar": req.body.title_ar,
          "description.en": req.body.description_en,
          "description.ar": req.body.description_ar,
          price: req.body.price,
          categoryId: req.body.categoryId,
          color,
          size,
          store: req.body.store,
          subCategory: req.body.subCategory,
          // sale: req.body.sale,
          // onsale: req.body.onsale,
          // low: req.body.low,
          // image:
          //   req.files.length > 0
          //     ? req.body.imgId[0] === "undefined"
          //       ? req.files[req.imgIndx++].path
          //       : req.body.image[0]
          //     : req.body.image[0],
          // status: req.body.status,
          // brand: req.body.brand,
          // isApproved: req.body.isApproved,
          user: req.user.roles[0] === 2 ? req.user._id : req.body.vendor,
        },
      }
    );
    // if (req.files.length > 0) {
    //   updateProdGal(req, res);
    // }
    prodFindCont.findById(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

const updateProdGal = async (req, res) => {
  try {
    if (Array.isArray(req.body.imgId)) {
      for (let i = 1; i < req.body.imgId.length; i++) {
        if (req.body.imgId[i] === "undefined") {
          await new ProductGallery({
            product: req.params.id,
            image: req.files[req.imgIndx++].path,
          }).save();
        }
      }
    }
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// for mobile
const updGalImg = async (req, res) => {
  try {
    const prodImgId = await Products.findById(req.params.id);
    if (req.body.new === "true") {
      const newProdGal = await new ProductGallery({
        image: req.file.path,
        product: req.params.id,
      }).save();
    } else {
      if (prodImgId === null) {
        const progGallery = await ProductGallery.findById(req.params.id);
        const prodGalUpdImgId = await ProductGallery.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              image: req.file.path,
            },
          }
        );
      } else {
        const prodUpdImgId = await Products.findByIdAndUpdate(req.params.id, {
          $set: {
            image: req.file.path,
          },
        });
      }
    }
    dSuc(res, req.t("DISPLAY.SUCCESS"));
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// لما مستخدم يديله تقييم يروح يتضاف فى الجدول بتاع المنتج
const updateRate = async (req, res) => {
  try {
    const prodTable = await Products.findById(req.body.product);
    const upd = await Products.findByIdAndUpdate(req.body.product, {
      $push: { "rate.all": req.body.rate },
      $set: {
        "rate.value":
          prodTable.rate.all.length > 0
            ? (prodTable.rate.all.reduce((prev, curr) => prev + curr) +
                req.body.rate) /
              (prodTable.rate.all.length + 1)
            : req.body.rate,
      },
    });
    req.description = {
      en: `${req.user.fullname} gave your product ${req.body.rate} rates`,
      ar: `قد تم اضافه تقييم ${req.body.rate} على المنتج الخاص بك بواسطه ${req.user.fullname}`,
    };
    req.reciever = prodTable.user;
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { updateById, updateProdGal, updGalImg, updateRate };
