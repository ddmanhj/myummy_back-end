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

exports.createOrder = async (
  dishes,
  totalItemValue,
  totalValueAfterDiscount,
  discount
) => {
  const accessToken = await generateToken();

  try {
    const response = await axios({
      url: process.env.PAYPAL_BASE_URL + "/v2/checkout/orders",
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        intent: "CAPTURE",
        purchase_units: [
          {
            items: dishes,
            amount: {
              currency_code: "USD",
              value: totalValueAfterDiscount.toString(),
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: totalItemValue.toString(),
                },
                discount: {
                  currency_code: "USD",
                  value: discount.toString(), // Giá trị khuyến mãi
                },
              },
            },
          },
        ],

        application_context: {
          return_url: "http://localhost:5173/payment",
          cancel_url: "http://localhost:5173/checkout",
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          brand_name: "Myummy",
        },
      },
    });
    return response.data.links.find((link) => link.rel === "approve").href;
  } catch (error) {
    console.log(error);
  }
};

exports.capturePayment = async (orderID) => {
  const accessToken = await generateToken();

  try {
    const response = await axios({
      url: `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
