const axios = require('axios');

const reference = require("../ref/path");
const api_path = reference.api_path
const {sql} = require("../models/db");

exports.productsRouter = async(req,res,next) => {
    console.log("api producthome called")
    const {email,name} = req.session.user
    console.log(email,name)
    try{
        // left join user_urls and products_data on product_id
        const response_data = await sql`
        SELECT 
            uu.product_id,
            pd.product_price,
            pd.product_name,
            pd.product_url,
            pd.product_image,
            pd.product_discount,
            pd.product_max_price
        FROM user_urls uu
        LEFT JOIN products_data pd
        ON uu.product_id = pd.product_id
        WHERE uu.email = ${email}
        `;
        return res.json(response_data)
        }
        catch(error){
            return res.status(500).json({message:error.message || "Internal Server Error"});
        }
};

exports.postadd_product = async(req,res,next) =>{
    const {url} = req.body;
    try{
        // check wheather he can add the product or not
        if (req.session.user.role==='free_user' && req.session.user.product_tracking>100){
            return res.json({message:'limit exceed for free user'});
        }
        // capture product_id from url
        const match = url.match(/\/dp\/([A-Z0-9]{10})/);
        if (!match) {
            console.log("Invalid URL: No product_id found");
            return res.json({message:'invalid url'});
        }
        // increase the count of tracking products by 1
        req.session.user.products_tracking = req.session.user.products_tracking+1
        await sql`
            UPDATE signup 
            SET products_tracking = ${req.session.user.products_tracking}
            WHERE email = ${req.session.user.email}
        `;
        const product_id = match[1]; 
        // check if the product is already being tracked or not
        const check_already_searching_by_user = await sql`
            SELECT * 
            FROM user_urls
            WHERE email=${req.session.user.email} && product_id=${product_id}
        `;
        if(check_already_searching_by_user.length>0){
            return res.json({message:"PRODUCT ALREADY SEARCHING"})
        }
        const check_already_searching_by_us = await sql`
            SELECT * 
            FROM products_data
            WHERE product_id=${product_id}
            `;
        await sql`
                INSERT INTO user_urls(email,product_id)
                VALUES (${req.session.user.email},${product_id})  
            `;
        if(check_already_searching_by_us.length>0){
            return res.json({message:"PRODUCT ADDED SUCCESSFULLY"})
        }
        await sql`
            INSERT INTO product_ids(product_id)
            VALUES (${product_id})
            `; 
        // else start a seprate tracking for him
        const product_url = `https://www.amazon.in/dp/${product_id}`;
        const response = await axios.post(`${api_path}/addproduct`,{
                product_id: product_id,
                product_url: product_url
            },{
                headers: { "Content-Type": "application/json" }
            });
        return res.json({ status: "success", message: "PRODUCT ADDED SUCCESSFULLY" });
    }
    catch(error){
        // if any error is raised
        return res.status(500).json({message:error.message || "Internal Server Error"});
    }
};

exports.search = async(req,res,next) => {
    const {productName} = req.params;
    try{
        const response = await axios.post(`${api_path}/searchproduct`,{
                name: productName,
                email: req.session.user.email
            },{
                headers: { "Content-Type": "application/json" }
            });
        if (!response.data || response.data.length === 0) {
            return res.json({ message: "NO PRODUCTS FOUND" });
        }
        return res.json(response.data)
    }
    catch(error){
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}

exports.add_searched_product = async(req,res,next) => {
    try{
        const {product_id} = req.params;
        const check_already_searching_by_user = await sql`
            SELECT * 
            FROM user_urls
            WHERE email=${req.session.user.email} AND product_id=${product_id}
        `;
        if(check_already_searching_by_user.length>0){
            return res.json({message:"PRODUCT ALREADY SEARCHING"})
        }
        const check_already_searching_by_us = await sql`
            SELECT * 
            FROM products_data
            WHERE product_id=${product_id}
            `;
        await sql`
                INSERT INTO user_urls(email,product_id)
                VALUES (${req.session.user.email},${product_id}) 
                ON CONFLICT DO NOTHING 
            `;
        if(check_already_searching_by_us.length>0){
            return res.json({message:"PRODUCT ADDED SUCCESSFULLY"})
        }
        await sql`
            INSERT INTO product_ids(product_id)
            VALUES (${product_id})
            ON CONFLICT DO NOTHING
            `;
        const product_url = `https://www.amazon.in/dp/${product_id}`;
        const response = await axios.post(`${api_path}/addproduct`,{
                product_id: product_id,
                product_url: product_url
            },{
                headers: { "Content-Type": "application/json" }
            });
        return res.json({ status: "success", message: "PRODUCT ADDED SUCCESSFULLY" });



    }
    catch(error){
        return res.status(500).json({message:error.message || "Internal Server Error"})
    }
    

}

