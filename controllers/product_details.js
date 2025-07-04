const path = require('path');
const { sql } = require('../models/db');

exports.product = async (req, res, next) => {
  const product_id = (req.params.product_id);
  console.log("details api called")
  console.log(product_id)
  try {
    const productResult = await sql`
    SELECT * FROM products_data WHERE product_id = ${product_id} LIMIT 1
    `;
    console.log(productResult)
    if (productResult.length === 0) {
      console.log("no output")
      return res.render('404', { pageTitle: 'Product Not Found' });
    }
    const product = productResult[0];
    console.log("product")
    console.log(product)
    
    const todayResult = await sql
      `SELECT product_price FROM products_data WHERE product_id = ${product_id} AND date = CURRENT_DATE`
      ;
    console.log(todayResult)
    const todayPrice = todayResult[0]?.product_price || null;
    console.log(todayPrice)
    const maxResult = await sql
      `SELECT MAX(product_price) AS max_price FROM products_data WHERE product_id = ${product_id}
      `;
    const maxPrice = maxResult[0].max_price || todayPrice;
    console.log(maxPrice)
    const historyResult = await sql
      `SELECT date, product_price FROM products_data
       WHERE product_id = ${product_id} ORDER BY date ASC
       `;

    const priceHistory = historyResult.rows;
    console.log(priceHistory)
    const discount = maxPrice && todayPrice
      ? Math.round(((maxPrice - todayPrice) / maxPrice) * 100)
      : 0;

    if (req.session.user?.name) {
      // res.render('product', {
      //   pageTitle: 'Product Details',
      //   username: req.session.user.name,
      //   image_path: product.product_image,
      //   name: product.product_name,
      //   price: todayPrice,
      //   max_price: maxPrice,
      //   discount: discount,
      //   priceHistory: priceHistory
      // });
      return res.json({
        username: req.session.user.name,
        product_image: product.product_image,
        product_name: product.product_name,
        product_price: todayPrice,
        max_price: maxPrice,
        discount: discount,
        priceHistory: priceHistory
      });
    }
  } catch (err) {
    return console.error('Error fetching product:', err);
    
  }
};
