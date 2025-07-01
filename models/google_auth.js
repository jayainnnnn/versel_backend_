// GOOGLE_CLIENT_ID=your_google_client_id
// GOOGLE_CLIENT_SECRET=your_google_client_secret
// GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
// SESSION_SECRET=random_secret_key
// const express = require("express");
// const session = require("express-session");
// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// require("dotenv").config();

// const app = express();

// // Session setup
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true,
// }));

// app.use(passport.initialize());
// app.use(passport.session());

// // Serialize & deserialize user
// passport.serializeUser((user, done) => {
//   done(null, user);
// });
// passport.deserializeUser((obj, done) => {
//   done(null, obj);
// });

// Google OAuth strategy
// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: process.env.GOOGLE_CALLBACK_URL
// },
// (accessToken, refreshToken, profile, done) => {
//   return done(null, profile); // You can save this profile to DB
// }));

// // Routes
// app.get("/", (req, res) => {
//   res.send(`<h1>Home</h1><a href="/auth/google">Login with Google</a>`);
// });

// app.get("/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// app.get("/auth/google/callback", 
//   passport.authenticate("google", { failureRedirect: "/" }),
//   (req, res) => {
//     res.redirect("/dashboard");
//   }
// );

// app.get("/dashboard", (req, res) => {
//   if (!req.isAuthenticated()) {
//     return res.redirect("/");
//   }
//   res.send(`<h1>Hello ${req.user.displayName}</h1><a href="/logout">Logout</a>`);
// });

// app.get("/logout", (req, res) => {
//   req.logout(() => {
//     res.redirect("/");
//   });
// });

// // Start server
// app.listen(3000, () => {
//   console.log("Server started on http://localhost:3000");
// });

