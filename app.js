// core modules
// const path = require('path');
// const rootdir = require('./utils/pathutil');
const cors = require("cors");
// external depandencies
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

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
const { setupSocket } = require('./sockets/socket.js');
const server = http.createServer(app);
setupSocket(server);


const sessionMiddleware = session.sessionMiddleware
app.use(sessionMiddleware)

// app.set('view engine', 'ejs');
// app.set('views', 'views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, 'public')));


app.use("/",page_limiter,homeRouter);
app.use("/category",requireLogin,page_limiter,categoryRouter);
app.use("/producthome",requireLogin,add_product_limiter,productRouter);
app.use("/admin",requireAdmin,page_limiter,adminRouter)





const PORT = 3008;

server.listen(PORT, () => {
    console.log(`Server Running at http://localhost:${PORT}`);
});