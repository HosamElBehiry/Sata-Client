const ShippingCompany = require("../../models/ShippingCompany");
const findCompShipCont = require("./find");
const { dE } = require("../../shared/shared");

const updateById = async (req, res) => {
  try {
    const { name, email, mobile, status, telephone, address, logo } = req.body;
    const updComp = await ShippingCompany.findByIdAndUpdate(req.params.id, {
      $set: {
        name,
        email,
        mobile,
        status,
        telephone,
        address,
        logo: req.file ? req.file.path : logo,
      },
    });
    findCompShipCont.findById(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

// دى الحته بتاعت لما يعمل سوفت ديليت لكذا شركه مع بعض
const updateManyCompanies = async (req, res) => {
  try {
    const manyComp = await ShippingCompany.updateMany(
      { _id: { $in: req.body } },
      { $set: { isDeleted: true } }
    );
    findCompShipCont.findAll(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { updateById, updateManyCompanies };
