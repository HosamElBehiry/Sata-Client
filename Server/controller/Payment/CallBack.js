const { dE } = require("../../shared/shared");
var path = require("path");
// to be continued !!
const callBack = async (req, res) => {
  try {
    res.sendFile(path.join(__dirname + "/success.html"));
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { callBack };
