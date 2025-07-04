const category_filter = require('../models/category_filter').categoryKeywords
const { sql } = require('../models/db');
exports.product_category = async (req,res,next) => {
    const {item_category} = req.params;

    try{
        const keywords = category_filter[item_category];
        if (!keywords || keywords.length === 0) {
            return res.status(400).json({ message: "Invalid category or no keywords found." });
        }

        const conditions = keywords.map(kw => sql`product_name ILIKE ${'%' + kw + '%'}`);
        let whereClause = sql``;
        conditions.forEach((cond, idx) => {
        if (idx > 0) whereClause = sql`${whereClause} OR `;
        whereClause = sql`${whereClause} ${cond}`;
        });

        const todayProducts = await sql`
            SELECT *
            FROM products_data
            WHERE (${whereClause}) AND date = CURRENT_DATE
        `;
        if (todayProducts.length === 0) {
            return res.json([]);
        }

        const finalResult = [];
        for (const product of todayProducts) {
            const maxResult = await sql`
                SELECT MAX(product_price) AS max_price
                FROM products_data
                WHERE product_id = ${product.product_id}
            `;

            const maxPrice = (maxResult[0]?.max_price || product.product_price);
            const todayPrice = (product.product_price);

            const percentage_change = (
            (((maxPrice-todayPrice ) / maxPrice) * 100).toFixed(2)
            );

            finalResult.push({
                product_id: product.product_id,
                product_name: product.product_name,
                product_image: product.product_image,
                product_price: todayPrice,
                max_price: maxPrice,
                percentage_change,
                category: item_category
            });
        }
        return res.json(finalResult);
    }
    catch(err){
        console.error("Error fetching products by category:", err);
        res.status(500).json({ message: "Server error" });
    }
}