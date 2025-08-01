const cors = require("cors");
const express = require('express');
const session = require('./models/session');
const homeRouter = require('./routes/homeRouter.js');
const productRouter = require('./routes/productRouter.js');
const categoryRouter = require('./routes/categoryRouter.js')
const adminRouter = require('./routes/adminRouter.js')
const {page_limiter,add_product_limiter} = require('./models/ratelimit.js')
const {requireLogin,requireAdmin} = require('./models/auth.js')
const http = require("http");
const app = express();
require("dotenv").config();
console.log("AJTracker backend starting...");
app.set('trust proxy', 1);
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});
app.use(cors({
  origin:  process.env.frontend_url,
  credentials: true,
}));
// const { setupSocket } = require('./sockets/socket.js');
// const server = http.createServer(app);
// setupSocket(server);


const sessionMiddleware = session.sessionMiddleware
app.use(sessionMiddleware)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("AJTracker backend is alive");
});

app.use("/",page_limiter,homeRouter);
app.use("/category",page_limiter,categoryRouter);
app.use("/producthome",add_product_limiter,productRouter);
app.use("/admin",requireAdmin,page_limiter,adminRouter)

const PORT = process.env.PORT || 3008;

app.listen(PORT, () => {
    console.log(`Server Running at http://localhost:${PORT}`);
});