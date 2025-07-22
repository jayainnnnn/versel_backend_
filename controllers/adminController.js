const { sql } = require('../models/db');

exports.admin_dashboard = async(req,res,next) => {
    try{
        console.log("api called admin_dashboard")
        const userdetails = await sql`
            SELECT 
                COUNT(*) AS total_users,
                COUNT(CASE WHEN role = 'premium' THEN 1 END) AS premium_users,
                SUM(active_alerts) AS active_alerts
            FROM signup
        `;
        console.log("step1")
        const productdetails = await sql`
            select 
                COUNT(CASE WHEN product_discount>0 THEN 1 END) AS positive_discount,
                COUNT(CASE WHEN product_discount<0 THEN 1 END) as negative_Discount,
                COUNT(*) AS total_products
            from products_data
        `;
        console.log("step2")
        const topTracked = await sql`
            SELECT 
                product_name,
                product_price,
                product_image,
                users_tracked
            FROM products_data
            ORDER BY users_tracked DESC
            LIMIT 5
        `;
        console.log("step3")
        // const today_change = await sql`
        //     SELECT 
        //         SUM(total_free_users+total_premium_users) as total_users,
        //         total_premium_users AS total_premium_users,
        //         total_alerts,
        //         positive,
        //         negative
        //     FROM daily_change
        //     WHERE date = '2025-07-21'
        // `;
        console.log("step4")
        const weekly_change = await sql`
            SELECT
                positive,negative
            FROM daily_change
            ORDER BY date DESC
            LIMIT 7
        `;
        console.log("step5")

        
        return res.status(200).json({
            userdetails: userdetails[0],
            productdetails: productdetails[0],
            topTracked: topTracked,
            // today_change: today_change[0],
            weekly_change: weekly_change[0]
        });
    }
    catch(error){
        return res.status(500).json({message: error.message || "Internal Server Error"});
    };
};

exports.admin_all_users_details = async(req,res,next) => {
    try{
        const userdetails = await sql`
            select * from signup
        `;
        return res.status(200).json({userdetails: userdetails});
    }
    catch(error){
        return res.status(500).json({message: error.message || "Internal Server Error"});
    }
}

exports.admin_products_view = async(req,res,next) =>{
    console.log("product_view api called")
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
        console.log(response)
        return res.status(200).json({
            products: response
        });
    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({message: error.message || "Internal Server Error"});
    }
}

exports.admin_product_update = async (req, res, next) => {
  try {
    const { product_id } = req.params;
    const {
      product_name,
      product_price,
      product_image,
      product_discount,
      product_max_price,
      users_tracked,
      product_url
    } = req.body;

    await sql`
      UPDATE products_data
      SET 
        product_name = ${product_name},
        product_price = ${product_price},
        product_image = ${product_image},
        product_discount = ${product_discount},
        product_max_price = ${product_max_price},
        users_tracked = ${users_tracked},
        product_url = ${product_url}
      WHERE product_id = ${product_id}
    `;

    return res.status(200).json({message:"SUCCESS"});
  } 
  catch (error) {
    console.error("Admin product update error:", error);
    return res.status(500).json({message: error.message || "Internal Server Error"});
  };
};

exports.admin_product_delete = async(req,res,next) =>{
    try{
        const {product_id} = req.params;
        await sql`BEGIN`;
            await sql`
                UPDATE signup
                SET products_tracking = products_tracking - 1
                WHERE email IN (
                    SELECT email FROM user_urls WHERE product_id = ${product_id})
            `;
            await sql`
                DELETE 
                FROM products_data
                WHERE product_id = ${product_id}
            `;
            await sql`
                DELETE
                FROM user_urls
                WHERE product_id = ${product_id}
            `;
            await sql`
                DELETE
                FROM product_price_history
                WHERE product_id = ${product_id}
            `;
            await sql`
                DELETE
                FROM product_ids
                WHERE product_id = ${product_id}
            `;
        await sql`COMMIT`;
        
        return res.status(200).json({message:"SUCCESS"});
    }
    catch(error){
        await sql`ROLLBACK`;
        return res.status(500).json({message: error.message || "Internal Server Error"});
    };
};

exports.admin_user_update = async(req,res,next) =>{
    try{
        console.log("api admin user update")
        const {email} = req.params;
        const {name,phone_number,products_tracking,role,active_alerts,billing,signup_date} = req.body;
        await sql`
            UPDATE signup
            SET 
                name = ${name},
                phone_number = ${phone_number},
                products_tracking = ${products_tracking},
                role = ${role},
                active_alerts = ${active_alerts},
                billing = ${billing},
                signup_date = ${signup_date}
            WHERE email = ${email}
        `;
        return res.status(200).json({message:"SUCCESS"});
    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({message: error.message || "Internal Server Error"});
    }
}

exports.daily_change_calculation = async(req,res,next) =>{
    try{
        return res.status(500).json({message: error.message || "Internal Server Error"});
    }
    catch(error){
        return res.status(500).json({message: error.message || "Internal Server Error"});
    }
}