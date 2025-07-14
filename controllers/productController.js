const axios = require('axios');

const reference = require("../ref/path");
const api_path = reference.api_path
const {sql} = require("../models/db");
const { param } = require('../routes/productRouter');

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
            return res.json({message: 'Error'})
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
        const product_tracking = await sql`
            SELECT * FROM products_data where product_id = ${product_id}
        `;
        // if being tracked provide the details from here
        if (product_tracking.length !==0){
            await sql`
            INSERT INTO user_urls (email,product_url,product_id)
            VALUES (${req.session.user.email},${url},${product_id})
            `;
            return res.json({ message: 'Already tracking this product' });
        } 
        // else start a seprate tracking for him
        const response = await axios.post(`${api_path}/addproduct`,{
                url,
                email: req.session.user.email
            },{
                headers: { "Content-Type": "application/json" }
            });
            return res.json({message:'successful'})
        }
    catch(error){
        // if any error is raised
        return res.status(500).json({ message: "Server error" });
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

