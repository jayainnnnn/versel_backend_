const { sql } = require('../models/db');

exports.usersdetails = async(req,res,next) => {
    try{
        const userdetails = await sql`
            SELECT 
                COUNT(email) AS total_users,
                COUNT(CASE WHEN role = 'premium' THEN 1 END) AS premium_users
            FROM signup
        `;
        return res.json(userdetails)
    }

    catch(error){
        return res.error(error)
    }
};
exports.productdetails = async(req,res,next) => {
    try{
        const productdetails = await sql`
            select 
                COUNT(CASE WHEN product_discount>0 THEN 1 END) AS positive_discount,
                COUNT(CASE WHEN product_discount<0 THEN 1 END) as negetive_Discount
            from products_data
        `;
        return res.json(productdetails)
    }
    catch(error){
        return res.error(error)
    }
    
}