const Rating = require("../../models/Rating");
const rateFndCont = require("./find");
const { dE } = require("../../shared/shared");

const updateById = async (req, res) => {
  try {
    const updRate = await Rating.findByIdAndUpdate(req.params.id, {
      $set: {
        rate: req.body.rate,
        comment: req.body.comment,
        status: req.body.status,
      },
    });
    rateFndCont.findById(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { updateById };
