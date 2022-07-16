const Orders = require("../../models/Orders");
const ordFindCont = require("./find");
const { dE } = require("../../shared/shared");

const deleteById = async (req, res) => {
  try {
    const ordData = await Orders.findByIdAndUpdate(req.params.id, {
      $set: { isDeleted: true },
    });
    ordFindCont.findById(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { deleteById };
