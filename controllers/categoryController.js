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
        SELECT 
            p.product_id,
            p.product_name,
            p.product_image,
            p.product_price,
            p.product_max_price,
            p.product_discount
        FROM products_data p
        WHERE (${whereClause})
        ORDER BY p.product_discount DESC
        `;
        const finalResult = todayProducts.map(product => ({
        product_id: product.product_id,
        product_name: product.product_name,
        product_image: product.product_image,
        product_price: product.product_price,
        max_price: product.product_max_price,
        percentage_change: product.product_discount,
        category: item_category
        }));

        return res.json(finalResult);
    }
    catch(err){
        console.error("Error fetching products by category:", err);
        res.status(500).json({ message: "Server error" });
    }
}
exports.home_product_category = async (req,res,next) => {
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
            SELECT 
                p.product_id,
                p.product_name,
                p.product_image,
                p.product_price,
                p.product_max_price,
                p.product_discount
            FROM products_data p
            WHERE (${whereClause})
            ORDER BY p.product_discount DESC
            LIMIT 10
        `;
        // WHERE (${whereClause}) AND p.date = CURRENT_DATE
        const finalResult = todayProducts.map(product => ({
        product_id: product.product_id,
        product_name: product.product_name,
        product_image: product.product_image,
        product_price: product.product_price,
        max_price: product.product_max_price,
        percentage_change: product.product_discount,
        category: item_category
        }));

        return res.json(finalResult);
    }
    catch(err){
        console.error("Error fetching products by category:", err);
        res.status(500).json({ message: "Server error" });
    }
}

