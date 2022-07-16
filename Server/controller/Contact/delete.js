const Contact = require("../../models/Contact");
const { dE, dSuc } = require("../../shared/shared");

const deleteById = async (req, res) => {
  try {
    const delCont = await Contact.findByIdAndDelete(req.params.id);
    dSuc(res, req.t("DELETED.SUCCESSFULLY"));
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { deleteById };
