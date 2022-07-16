const request = require("request-promise");
const OrdRegCont = require("./OrderRegisterationAPI");
const { dE } = require("../../shared/shared");

const getToken = async (req, res) => {
  const options = {
    method: "POST",
    uri: " https://accept.paymob.com/api/auth/tokens",
    body: {
      // دى هاخدها من البشمهندس ضياء وحاطط بتاعتى كتيست فقط
      api_key: process.env.API_KEY,
    },
    json: true,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const data = await request(options);
    req.AuthReq = data;
    OrdRegCont.OrdRegAPI(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { getToken };
