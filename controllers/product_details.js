const { sql } = require('../models/db');

exports.product = async (req, res, next) => {
  const product_id = (req.params.product_id);
  try {
    const productResult = await sql`
      SELECT * FROM products_data WHERE product_id = ${product_id} LIMIT 1
    `;
    if (productResult.length === 0) {
      return res.json({Message:"NO PRODUCT FOUND"})
    }
    const product = productResult[0];
    const todayResult = await sql
      `SELECT product_price FROM products_data 
        WHERE product_id = ${product_id} AND date = CURRENT_DATE
      `;
    const todayPrice = todayResult[0]?.product_price || null;
    const maxResult = await sql
      `SELECT MAX(product_price) AS max_price FROM products_data 
        WHERE product_id = ${product_id}
      `;
    const maxPrice = maxResult[0].max_price || todayPrice;
    const historyResult = await sql
      `SELECT date, product_price FROM products_data
       WHERE product_id = ${product_id} ORDER BY date ASC
       `;
    const discount = maxPrice && todayPrice
      ? Math.round(((maxPrice - todayPrice) / maxPrice) * 100)
      : 0;
    return res.json({
        username: req.session.user.name,
        product_image: product.product_image,
        product_name: product.product_name,
        product_price: todayPrice,
        max_price: maxPrice,
        discount: discount,
        priceHistory: historyResult
      });
    }
  catch (error) {
    return res.status(500).json({message: error.message || "Internal Server Error"});
    }
};
