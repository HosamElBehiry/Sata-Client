const Products = require("../../models/Products");
const { dE, dSuc } = require("../../shared/shared");
const prodFndCont = require("./find");
const vendDelCont = require("../Vendor/delete");

const deleteById = async (req, res) => {
  try {
    if (req.user.roles[0] === 2) {
      vendDelCont.delProdById(req, res);
    } else {
      const prodData = await Products.findByIdAndUpdate(req.params.id, {
        $set: { isDeleted: true },
      });
      prodFndCont.findById(req, res);
    }
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// مستخدمها عشان اعمل سوفت ديليت لكذا منتج
const deleteMany = async (req, res) => {
  try {
    const delProds = await Products.updateMany(
      { _id: { $in: req.body } },
      { $set: { isDeleted: true } }
    );
    dSuc(res, req.t("DISPLAY.SUCCESS"));
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { deleteById, deleteMany };
