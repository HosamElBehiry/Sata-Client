const request = require("request-promise");
const paymentKeyCont = require("./PaymentKeyRequest");
const { dE } = require("../../shared/shared");

const OrdRegAPI = async (req, res) => {
  try {
    const options = {
      method: "POST",
      uri: "https://accept.paymob.com/api/ecommerce/orders",
      body: {
        auth_token: req.AuthReq.token,
        delivery_needed: "true",
        amount_cents: "120",
        currency: "EGP",
        terminal_id: 23772,
        merchant_order_id: Math.random() * 4565656555656, // مؤقتا عشان اتفادى موضوع خطا التكرارات
        items: [
          {
            name: "ASC1515",
            amount_cents: "500000",
            description: "Smart Watch",
            quantity: "1",
          },
          {
            name: "ERT6565",
            amount_cents: "200000",
            description: "Power Bank",
            quantity: "1",
          },
        ],
        shipping_data: {
          apartment: "803",
          email: "email1@example.com",
          floor: "42",
          first_name: "User 1",
          street: "Ethan Land",
          building: "8028",
          phone_number: "012345678910",
          postal_code: "01898",
          extra_description: "8 Ram , 128 Giga",
          city: "Jaskolskiburgh",
          country: "CR",
          last_name: "User 1",
          state: "Utah",
        },
        shipping_details: {
          notes: " test",
          number_of_packages: 1,
          weight: 1,
          weight_unit: "Kilogram",
          length: 1,
          width: 1,
          height: 1,
          contents: "product of some sorts",
        },
      },
      json: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    const data = await request(options);
    req.orderId = data.id;
    paymentKeyCont.PaymentToken(req, res);
  } catch (error) {
    dE(res, req.t("DISPLAY.ERROR"));
  }
};

module.exports = { OrdRegAPI };
