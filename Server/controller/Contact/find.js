const Contact = require("../../models/Contact");
const { dE, dSuc } = require("../../shared/shared");

const findById = async (req, res) => {
  try {
    const contId = await Contact.findById(
      req.newCont ? req.newCont._id : req.params.id
    );
    dSuc(res, contId);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

const findAll = async (req, res) => {
  try {
    const contData = await Contact.find();
    dSuc(res, contData);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { findById, findAll };
