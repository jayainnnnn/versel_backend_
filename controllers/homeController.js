const {sql} = require("../models/db");
const bcrypt = require('bcrypt');
const { getIO } = require("../sockets/socket");


exports.postlogin = async(req,res,next) => {
    // collect details from login form
    console.log("postlogin")
    const {email, password} = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
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



        return res.json({
            message:"SUCCESS", 
            user: {
                name: user_data[0].name,
                email: user_data[0].email,
                role: user_data[0].role,
            },
        });
    }
    catch(error){
        return res.status(500).json({message: error.message || "Internal Server Error"});
    }
}

exports.postsignup = async(req,res,next) => {
    const { name, email, password, phone_number} = req.body;
    console.log(req.body);
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

            result = await sql`
                select 
                    COUNT(email) as total_users,
                    COUNT(CASE WHEN role = 'premium' THEN 1 END) AS premium_users
                from signup
            `;


            const io = getIO();
            io.emit("userCounts", result[0]);

            return res.json({ message: "SUCCESS" });
        }
        catch(error){
            return res.status(500).json({message: error.message || "Internal Server Error"});
        }
}

exports.getlogout = (req,res,next) => {
    try{
        req.session.destroy();
        return res.status(200).json({message:"SUCCESS"});
    }
    catch(error){
       return res.status(500).json({message: error.message || "Internal Server Error"});
    }
}
