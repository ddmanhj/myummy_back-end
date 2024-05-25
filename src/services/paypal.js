const axios = require("axios");

async function generateToken() {
  const response = await axios({
    url: process.env.PAYPAL_BASE_URL + "/v1/oauth2/token",
    method: "post",
    data: "grant_type=client_credentials",
    auth: {
      username: process.env.PAYPAL_CLIENT_ID,
      password: process.env.PAYPAL_SECRET,
    },
  });

  return response.data.access_token;
}

exports.createOrder = async () => {
  const accessToken = await generateToken();

  const response = await axios({
    url: process.env.PAYPAL_BASE_URL + "/v2/checkout/orders",
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          items: [
            {
              name: "Veg Buger",
              unit_amount: {
                currency_code: "USD",
                value: "100",
              },
              quantity: 1,
              description: "Tasty Veg Burger",
            },
          ],

          amount: {
            currency_code: "USD",
            value: "100",
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: "100",
              },
            },
          },
        },
      ],

      application_context: {
        return_url: `${process.env.CLIENT_URL}payment-success`,
        cancel_url: `${process.env.CLIENT_URL}checkout`,
        // shipping_preference: "NO_SHIPPING",
        // user_action: "PAY NOW",
        // brand_name: "Myummy",
      },
    }),
  });

  return response.data.links.find((link) => link.rel === "approve").href;
};
this.createOrder();
