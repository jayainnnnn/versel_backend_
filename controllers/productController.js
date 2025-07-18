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
    const email = req.session.user.email
    const match = url.match(/\/dp\/([A-Z0-9]{10})/);
        if (!match) {
            console.log("Invalid URL: No product_id found");
            return res.json({message:'invalid url'});
        }
    try{
        const product_id = match[1]; 
        console.log("step 1 api called with valid url")
        // check wheather he can add the product or not
        if (req.session.user.role==='free_user' && req.session.user.product_tracking>100){
            return res.json({message:'limit exceed for free user'});
        }
        
        console.log("step 2 allowed user")
        const check_already_searching_by_user = await sql`
            SELECT * 
            FROM user_urls
            WHERE email=${req.session.user.email} AND product_id=${product_id}
        `;
        if(check_already_searching_by_user.length>0){
            return res.json({message:"PRODUCT ALREADY SEARCHING"})
        }
        console.log("step 3 check_already_searching_by_user allowed")
        const check_already_searching_by_us = await sql`
            SELECT * 
            FROM products_data
            WHERE product_id=${product_id}
            `;
        if(check_already_searching_by_us.length>0){
            const updatedCount = req.session.user.products_tracking + 1;
            await sql`BEGIN`;
            await sql`
                UPDATE signup 
                SET products_tracking = ${updatedCount}
                WHERE email = ${email}
            `;
            await sql`
                    INSERT INTO user_urls (email, product_id)
                    VALUES (${email}, ${product_id})
                `;
            req.session.user.products_tracking = updatedCount;
            await sql`COMMIT`;
            return res.json({message:"PRODUCT ADDED SUCCESSFULLY"})
        }
        console.log("step 4 check_already_searching_by_us allowed")
        // else start a seprate tracking for him
        const product_url = `https://www.amazon.in/dp/${product_id}`;
        const response = await axios.post(`${api_path}/addproduct`,{
                product_id: product_id,
                product_url: product_url
            },{
                headers: { "Content-Type": "application/json" }
            });
        
        console.log("step 5 api called success")
        console.log(response.status)
        if(response.status===200){
            console.log("if called")
            req.session.user.products_tracking = req.session.user.products_tracking+1
            await sql`
                UPDATE signup 
                SET products_tracking = ${req.session.user.products_tracking}
                WHERE email = ${req.session.user.email}
            `;
            await sql`
                    INSERT INTO user_urls (email, product_id)
                    VALUES (${email}, ${product_id})
            `;
            console.log("step 5.1: user_urls insert");

            await sql`
                    INSERT INTO product_ids (product_id)
                    VALUES (${product_id})
            `;
            console.log("step 5.2: product_ids insert");
            }
            else{
                return res.json({ status: "Failed", message: "PRODUCT FAILED TO ADD" });
            }
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
        const email = req.session.user.email;
        console.log("step 1 api called with valid id")
        // check wheather he can add the product or not
        if (req.session.user.role==='free_user' && req.session.user.product_tracking>100){
            return res.json({message:'limit exceed for free user'});
        }
        
        console.log("step 2 allowed user")
        const check_already_searching_by_user = await sql`
            SELECT * 
            FROM user_urls
            WHERE email=${req.session.user.email} AND product_id=${product_id}
        `;
        if(check_already_searching_by_user.length>0){
            return res.json({message:"PRODUCT ALREADY SEARCHING"})
        }
        console.log("step 3 check_already_searching_by_user allowed")
        const check_already_searching_by_us = await sql`
            SELECT * 
            FROM products_data
            WHERE product_id=${product_id}
            `;
        if(check_already_searching_by_us.length>0){
            const updatedCount = req.session.user.products_tracking + 1;
            await sql`BEGIN`;
            await sql`
                UPDATE signup 
                SET products_tracking = ${updatedCount}
                WHERE email = ${email}
            `;
            await sql`
                    INSERT INTO user_urls (email, product_id)
                    VALUES (${email}, ${product_id})
                `;
            req.session.user.products_tracking = updatedCount;
            await sql`COMMIT`;
            return res.json({message:"PRODUCT ADDED SUCCESSFULLY"})
        }
        console.log("step 4 check_already_searching_by_us allowed")
        // else start a seprate tracking for him
        const product_url = `https://www.amazon.in/dp/${product_id}`;
        const response = await axios.post(`${api_path}/addproduct`,{
                product_id: product_id,
                product_url: product_url
            },{
                headers: { "Content-Type": "application/json" }
            });
        
        console.log("step 5 api called success")
        console.log(response.status)
        if(response.status===200){
            console.log("if called")
            req.session.user.products_tracking = req.session.user.products_tracking+1
            await sql`
                UPDATE signup 
                SET products_tracking = ${req.session.user.products_tracking}
                WHERE email = ${req.session.user.email}
            `;
            await sql`
                    INSERT INTO user_urls (email, product_id)
                    VALUES (${email}, ${product_id})
            `;
            console.log("step 5.1: user_urls insert");

            await sql`
                    INSERT INTO product_ids (product_id)
                    VALUES (${product_id})
            `;
            console.log("step 5.2: product_ids insert");
            }
            else{
                return res.json({ status: "Failed", message: "PRODUCT FAILED TO ADD" });
            }
        return res.json({ status: "success", message: "PRODUCT ADDED SUCCESSFULLY" });
    }
    catch(error){
        // if any error is raised
        return res.status(500).json({message:error.message || "Internal Server Error"});
    }
};

exports.product_remove = async (req, res, next) => {
    try {
        console.log("remove api called");
        const { product_id } = req.params;
        const email = req.session.user.email;
        const updatedCount = req.session.user.products_tracking - 1;
        console.log("product_id:", product_id);

        await sql`BEGIN`;
        console.log("start");

        await sql`
            DELETE FROM user_urls
            WHERE product_id = ${product_id} AND email = ${email}
        `;
        console.log("deleted from user_urls");

        await sql`
            UPDATE signup
            SET products_tracking = ${updatedCount}
            WHERE email = ${email}
        `;
        console.log("updated signup");

        await sql`COMMIT`;
        console.log("commit");

        return res.json({
            token: updatedCount,
            status: "success"
        });
    } catch (error) {
        console.error("ERROR in product_remove:", error); // 🔥 IMPORTANT
        await sql`ROLLBACK`; // 🔥 REQUIRED to rollback incomplete transactions
        return res.status(500).json({
            message: error.message || "Internal Server Error"
        });
    }
};
