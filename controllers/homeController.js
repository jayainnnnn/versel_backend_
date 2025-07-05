const path = require('path');
const rootdir = require('../utils/pathutil');
const { sendLoginEmail } = require('../utils/email');
// const { sendSMS } = require('../utils/sms')
const {sql} = require("../models/db");
const bcrypt = require('bcrypt');
const { json } = require('stream/consumers');


exports.homeController = (req,res,next) => {
    res.render('home',{pageTitle:'home',username:req.session.user?.name});
};

// exports.getlogin = (req,res,next) => {
//     res.sendFile(path.join(rootdir, 'views', 'login.html'));
// }

exports.postlogin = async(req,res,next) => {
    // collect details from login form
    const {email, password} = req.body;
    try {
        // check weather a email is valid or not
        const user_data = await sql`
            SELECT * FROM signup WHERE email = ${email}
        `;
        if (user_data.length === 0){
            // if not registered then show a popup of invalid email
            return res.status(401).json({ message: "Invalid email" });
        }
        const isMatch = await bcrypt.compare(password, user_data[0].password);
        if (!isMatch){
            // if password does not match then show popup of incorrect password
            return res.status(401).json({ message: "Incorrect password" });
        }
        req.session.isLoggedin = true;
        req.session.user = {
            // insert details of user in session
            name: user_data[0].name,
            email: user_data[0].email,
            products_tracking: user_data[0].products_tracking,
            role: user_data[0].role
        };
            // send login alert email and sms 
            // await sendSMS();
            // await sendLoginEmail(user.email, user.name);
        // return res.render('home',{pageTitle:'Home',username:user_data[0].name});
        return res.json({
            message: "Login successful",
            
            user: {
                name: user_data[0].name,
                email: user_data[0].email,
                role: user_data[0].role,
            },
        });
    }
    catch(error){
        // return res.sendFile(path.join(rootdir,'views','error.html'));
        console.error("Login error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
}

// exports.getsignup = (req,res,next) => {
//     res.sendFile(path.join(rootdir,'views','signup.html'));
// }

exports.postsignup = async(req,res,next) => {
    const { name, email, password, phone_number} = req.body;
    console.log(req.body)
        try{
            // Check if email already exists
            const existingUser = await sql`
            SELECT * FROM signup WHERE email = ${email}
            `;

            if (existingUser.length !== 0) {
                // a popup of user already exist
                // return res.sendFile(path.join(rootdir,'views','signup.html'));
                return res.status(500).json({ message: "Existing USER" });
            }
            const hashedPassword = await bcrypt.hash(password, 10);

            await sql`
                INSERT INTO signup (name, email, password, phone_number)
                VALUES (${name}, ${email}, ${hashedPassword}, ${phone_number})
            `;
            return res.json({ message: "SUCCESS" });
        }
        catch(error){
            res.status(500).json({ message: "Server error" });;
        }
}

exports.getlogout = (req,res,next) => {
    console.log("logout api called")
    try{
        req.session.destroy();
        console.log("session breaked success")
        return res.json({
            message:"successfully logout"
        })
    }
    catch(error){
        return res.json({
            message:"failed to logout"
        })
    }
}

// exports.get404 = (req,res,next) => {
//     res.sendFile(path.join(rootdir,'views','404.html'));
// }