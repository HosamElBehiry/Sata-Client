const Contact = require("../../models/Contact");
const findCont = require("./find");
const { dE } = require("../../shared/shared");

const updateById = async (req, res) => {
  try {
    const updCont = await Contact.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    findCont.findById(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { updateById };
