// global modules
const path = require('path');
const axios = require('axios');

const reference = require("../ref/path");
const api_path = reference.api_path
const {sql} = require("../models/db");
const rootdir = require('../utils/pathutil');

exports.productsRouter = async(req,res,next) => {
    const {email,name} = req.session.user
    try{
        // left join user_urls and products_data on product_id
        const response_data = await sql`
        SELECT 
            uu.product_id,
            pd.product_price,
            pd.date,
            pd.product_name,
            pd.product_url,
            pd.product_image
        FROM user_urls uu
        LEFT JOIN products_data pd
        ON uu.product_id = pd.product_id
        WHERE uu.email = ${email}
        `;
        res.render('producthome',{
            pageTitle:"products",
            username: name,
            products:response_data});
        }
        catch(error){
            res.sendFile(path.join(rootdir,'views','error.html'));
        }
};

exports.postadd_product = async(req,res,next) =>{
    const {url} = req.body;
    try{
        // check wheather he can add the product or not
        if (req.session.user.role==='free_user' && req.session.user.product_tracking>10){
            return {message:'limit exceed for free user'};
        }
        // capture product_id from url
        const match = url.match(/\/dp\/([A-Z0-9]{10})/);
        if (!match) {
            console.log("Invalid URL: No product_id found");
            return res.redirect('/producthome');
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
            SELECT * FROM product_ids where product_id = ${product_id}
        `;
        // if being tracked provide the details from here
        if (product_tracking.length !==0){
            await sql`
            INSERT INTO user_urls (email,product_url,product_id)
            VALUES (${req.session.user.email},${url},${product_id})
            `;
            return res.redirect('/producthome');
        } 
        // else start a seprate tracking for him
        const response = await axios.post(`${api_path}/addproduct`,{
                url,
                email: req.session.user.email
            },{
                headers: { "Content-Type": "application/json" }
            });
            return res.redirect('/producthome');
        }
    catch(error){
        // if any error is raised
        console.error('Error while adding product:', error.message);
        return res.redirect('/producthome')
    }
};

