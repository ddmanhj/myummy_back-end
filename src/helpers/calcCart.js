const axios = require("axios");
const sequelize = require("../utils/database");
const { isEmpty } = require("lodash");

async function calculateTotalPrice(orderItems) {
  // Tạo các biểu thức SQL cho id và quantity
  const idQuantityPairs = orderItems
    .map((item) => `SELECT ${item.id} AS id, ${item.quantity} AS quantity`)
    .join(" UNION ALL ");

  // Tạo một chuỗi SQL để tính tổng tiền
  const sql = `
        SELECT SUM(d.price * o.quantity) AS totalPrice
        FROM dishes d
        JOIN (
            ${idQuantityPairs}
        ) o ON d.id = o.id
    `;

  // Thực hiện truy vấn SQL
  const [results, metadata] = await sequelize.query(sql);
  return results[0].totalPrice;
}

// Get total each dish
async function calculateTotalEachDish(orderItems) {
  // Tạo các biểu thức SQL cho id và quantity
  const idQuantityPairs = orderItems
    .map((item) => `SELECT ${item.id} AS id, ${item.quantity} AS quantity`)
    .join(" UNION ALL ");

  // Tạo một chuỗi SQL để tính tổng tiền
  const sql = `
        SELECT d.id, d.price * o.quantity AS totalPrice
        FROM dishes d
        JOIN (
            ${idQuantityPairs}
        ) o ON d.id = o.id
    `;

  // Thực hiện truy vấn SQL
  const [results, metadata] = await sequelize.query(sql);

  return results;
}

// Get total show client paypal
async function calculateTotalEachDishForPaypal(orderItems) {
  // Tạo các biểu thức SQL cho id và quantity
  const idQuantityPairs = orderItems
    .map((item) => `SELECT ${item.id} AS id, ${item.quantity} AS quantity`)
    .join(" UNION ALL ");

  // Tạo một chuỗi SQL để tính tổng tiền
  const sql = `
        SELECT d.id, d.dishName, d.price, o.quantity
        FROM dishes d
        JOIN (
            ${idQuantityPairs}
        ) o ON d.id = o.id
    `;

  // Thực hiện truy vấn SQL
  const [results, metadata] = await sequelize.query(sql);

  return results;
}

async function exChangeRate(totalPrice) {
  const getKeyAPI = await axios.get(
    "https://vapi.vnappmob.com/api/request_api_key?scope=exchange_rate"
  );
  if (isEmpty(getKeyAPI?.data?.results))
    return parseFloat(totalPrice) / 25370, tofixed(2).toString();
  const getCurrentRate = await axios.get(
    "https://vapi.vnappmob.com/api/v2/exchange_rate/vcb",
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${getKeyAPI?.data?.results}`,
      },
    }
  );
  if (isEmpty(getCurrentRate?.data?.results))
    return parseFloat(totalPrice) / 25370, tofixed(2).toString();
  const getRate = getCurrentRate?.data?.results?.find(
    (item) => item.currency === "USD"
  );
  return (parseFloat(totalPrice) / getRate?.sell).toFixed(2).toString();
}

module.exports = {
  calculateTotalPrice,
  calculateTotalEachDish,
  calculateTotalEachDishForPaypal,
  exChangeRate,
};
