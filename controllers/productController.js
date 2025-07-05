// global modules
const path = require('path');
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
            pd.date,
            pd.product_name,
            pd.product_url,
            pd.product_image
        FROM user_urls uu
        LEFT JOIN products_data pd
        ON uu.product_id = pd.product_id
        WHERE uu.email = ${email} and
        pd.date = CURRENT_DATE
        `;
        console.log(response_data[0])
        return res.json(response_data)
        // res.render('producthome',{
        //     pageTitle:"products",
        //     username: name,
        //     products:response_data});
        // 
        }
        catch(error){
            // res.sendFile(path.join(rootdir,'views','error.html'));
            return res.json({message: 'Error'})
        }
};

exports.postadd_product = async(req,res,next) =>{
    const {url} = req.body;
    console.log("api called add_product")
    try{
        // check wheather he can add the product or not
        if (req.session.user.role==='free_user' && req.session.user.product_tracking>100){
            return res.json({message:'limit exceed for free user'});
        }
        console.log("user allowed")
        // capture product_id from url
        const match = url.match(/\/dp\/([A-Z0-9]{10})/);
        if (!match) {
            console.log("Invalid URL: No product_id found");
            return res.json({message:'invalid url'});
        }
        console.log("valid url")
        // increase the count of tracking products by 1
        req.session.user.products_tracking = req.session.user.products_tracking+1
        await sql`
            UPDATE signup 
            SET products_tracking = ${req.session.user.products_tracking}
            WHERE email = ${req.session.user.email}
        `;
        const product_id = match[1]; 
        console.log("product_id = ")
        console.log(product_id)
        // check if the product is already being tracked or not
        const product_tracking = await sql`
            SELECT * FROM product_ids where product_id = ${product_id}
        `;
        // if being tracked provide the details from here
        if (product_tracking.length !==0){
            console.log("product already found tracked",product_tracking)
            await sql`
            INSERT INTO user_urls (email,product_url,product_id)
            VALUES (${req.session.user.email},${url},${product_id})
            `;
            // return res.redirect('/producthome');
            return res.json("successful")
        } 
        // else start a seprate tracking for him
        const response = await axios.post(`${api_path}/addproduct`,{
                url,
                email: req.session.user.email
            },{
                headers: { "Content-Type": "application/json" }
            });
            return res.json({message:'successful'})
            // return res.redirect('/producthome');
        }
    catch(error){
        // if any error is raised
        console.error('Error while adding product:', error.message);
        // return res.redirect('/producthome')
        return res.json({message:'error occured'})
    }
};

