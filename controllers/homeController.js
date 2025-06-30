const path = require('path');
const rootdir = require('../utils/pathutil');
const { sendLoginEmail } = require('../utils/email');
// const { sendSMS } = require('../utils/sms')

const {sql} = require("../models/db");

exports.homeController = (req,res,next) => {
    res.render('home',{pageTitle:'home',username:req.session.user?.name});
};

exports.getlogin = (req,res,next) => {
    res.sendFile(path.join(rootdir, 'views', 'login.html'));
}

exports.postlogin = async(req,res,next) => {
    const {email, password} = req.body;
    try {
        const result = await sql`
            SELECT * FROM signup WHERE email = ${email} AND password = ${password}
        `;
        if (result.length === 0) {
            res.sendFile(path.join(rootdir,'views','error.html'));
        }
        const user = result[0];
        
        req.session.user = {
            name: user.name,
            email: user.email
        };

            // await sendSMS();
        await sendLoginEmail(user.email, user.name);


        res.render('home',{pageTitle:'Home',username:req.session.user?.name});
    }
    catch(error){
        res.sendFile(path.join(rootdir,'views','error.html'));
    }
}

exports.getsignup = (req,res,next) => {
    res.sendFile(path.join(rootdir,'views','signup.html'));
}

exports.postsignup = async(req,res,next) => {
    const { name, email, password, phone_number} = req.body;
    console.log(req.body)
        try{
            // Check if email already exists
            const existingUser = await sql`
            SELECT * FROM signup WHERE email = ${email}
            `;

            if (existingUser.length > 0) {
                res.sendFile(path.join(rootdir,'views','signup.html'));
            }

            await sql`
                INSERT INTO signup (name, email, password, phone_number)
                VALUES (${name}, ${email}, ${password}, ${phone_number})
            `;
            res.sendFile(path.join(rootdir,'views','login.html'));
        }
        catch(error){
            res.sendFile(path.join(rootdir,'views','signup.html'));
        }
}

exports.getlogout = (req,res,next) => {
    try{
        req.session.destroy();
        res.render('home',{pageTitle:'home',username:null});
    }
    catch(error){
        res.sendFile(path.join(rootdir,'views','error.html'));
    }
}

exports.get404 = (req,res,next) => {
    res.sendFile(path.join(rootdir,'views','404.html'));
}