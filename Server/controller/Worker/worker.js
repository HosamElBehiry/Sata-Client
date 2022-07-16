const Worker = require("../../models/Worker");
const { dE } = require("../../shared/shared");

const getWorkerById = async (req, res) => {
  try {
    const workerId = await Worker.findOne({ user: req.params.id });
    res.status(200).json(workerId);
  } catch (error) {
    dE(res, error);
  }
};

module.exports = { getWorkerById };
