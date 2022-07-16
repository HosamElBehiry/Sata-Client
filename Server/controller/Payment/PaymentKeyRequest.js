const request = require("request-promise");
const { dE, dSuc } = require("../../shared/shared");

const PaymentToken = async (req, res) => {
  try {
    const options = {
      method: "POST",
      uri: "https://accept.paymob.com/api/acceptance/payment_keys",
      body: {
        auth_token: req.AuthReq.token,
        amount_cents: "100",
        expiration: 3600,
        order_id: req.orderId,
        billing_data: {
          apartment: "803",
          email: "claudette09@exa.com",
          floor: "42",
          first_name: "Clifford",
          street: "Ethan Land",
          building: "8028",
          phone_number: "+86(8)9135210487",
          shipping_method: "PKG",
          postal_code: "01898",
          city: "Jaskolskiburgh",
          country: "CR",
          last_name: "Nicolas",
          state: "Utah",
        },
        currency: "EGP",
        integration_id: 1808590, // ده الاى دى بتاع التست بتاعى ومش بيفضل ثابت
      },
      json: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    const data = await request(options);
    dSuc(res, data);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { PaymentToken };
