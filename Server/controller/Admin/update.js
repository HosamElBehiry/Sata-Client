const Products = require("../../models/Products");

const updateProduct = async (req, res) => {
  try {
    const color = req.body.color
      .toString()
      .split(",")
      .map((col) => col.trim());
    const size = req.body.size
      .toString()
      .split(",")
      .map((col) => col.trim());
    const updProdId = await Products.updateOne(
      { _id: req.params.id },
      {
        $set: {
          "title.en": req.body.title_en,
          "title.ar": req.body.title_ar,
          image: req.file ? req.file.path : image,
          low: req.body.low,
          price: req.body.price,
          status: req.body.status,
          categoryId: req.body.categoryId,
          subCategory: req.body.subCategory,
          "description.en": req.body.description_en,
          "description.ar": req.body.description_ar,
          brand: req.body.brand,
          color,
          size,
          store: req.body.store,
          sale: req.body.sale,
          onsale: req.body.onsale,
          isApproved: req.body.isApproved,
          user: req.user._id,
        },
      }
    );
    prodFindCont.findById(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { updateProduct };
