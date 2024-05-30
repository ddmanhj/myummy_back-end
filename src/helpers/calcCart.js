const sequelize = require("../utils/database");

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

module.exports = {
  calculateTotalPrice,
  calculateTotalEachDish,
  calculateTotalEachDishForPaypal,
};
