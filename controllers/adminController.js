const { sql } = require('../models/db');

exports.admindashboard = async(req,res,next) => {
    try{
        const userdetails = await sql`
            SELECT 
                COUNT(email) AS total_users,
                COUNT(CASE WHEN role = 'premium' THEN 1 END) AS premium_users,
                SUM(active_alerts) AS active_alerts
            FROM signup
        `;
        const productdetails = await sql`
            select 
                COUNT(CASE WHEN product_discount>0 THEN 1 END) AS positive_discount,
                COUNT(CASE WHEN product_discount<0 THEN 1 END) as negetive_Discount,
                COUNT(product_name) as total_products
            from products_data
        `;
        return res.json({
            userdetails: userdetails[0],
            productdetails: productdetails[0]})
    }
    catch(error){
        return res.status(500).json({ message: "Server error" });
    }
};

exports.allusersdetails = async(req,res,next) => {
    try{
        const userdetails = await sql`
            select * from signup
        `;
        return res.json({
            userdetails: userdetails
        })
    }
    catch(error){
        return res.status(500).json({ message: "Server error" });
    }
}

exports.admin_products_view = async(req,res,next) =>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    try{
        const response = await sql`
        SELECT *
        FROM products_data
        LIMIT ${limit}
        OFFSET ${offset}
        `;
        return res.status(200).json({
            products: response
        })
    }
    catch(error){
        return res.status(500).json({ message: "Server error" });
    }
}
