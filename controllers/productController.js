// global modules
const path = require('path');
const axios = require('axios');

const reference = require("../ref/path");
const api_path = reference.api_path
const {sql} = require("../models/db");
const rootdir = require('../utils/pathutil');

exports.productsRouter = async(req,res,next) => {
    if (req.session.user?.name){
        const {email,name} = req.session.user
        try{
            const response_urls = await sql`
            SELECT * FROM user_urls WHERE email = ${email}
            `;
            let response_data = [];
            if (response_urls.length !==0){
                const id = response_urls.map(row => row.product_id);
                response_data = await sql`
                SELECT * FROM products_data WHERE product_id = ANY(${id})
                `;
            }
            res.render('producthome',{
                pageTitle:"products",
                username: req.session.user.name,
                products:response_data});
        }
        catch(error){
            res.sendFile(path.join(rootdir,'views','error.html'));
        }
    }
    else{
        res.render('home',{pageTitle:'home',username:req.session.user?.name});
    }
};

exports.postadd_product = async(req,res,next) =>{
    const {url} = req.body;
    try{
        const response = await axios.post(`${api_path}/addproduct`,{
                url,
                email: req.session.user.email
            },{
                headers: { "Content-Type": "application/json" }
            });
            console.log(user.email,url)
            return res.redirect('/producthome');
        }
    catch(error){
        console.error('Error while adding product:', error.message);
        return res.redirect('/producthome')
    }
};

