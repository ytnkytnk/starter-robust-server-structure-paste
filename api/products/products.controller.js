const db = require("../db/connections");

async function list(req, res, next) {
  const products = await db("products");
  res.json({ data: products });
}

module.exports = {
  list,
};
