// core modules
const path = require('path');
const rootdir = require('./utils/pathutil');
// external depandencies
const express = require('express');

const session = require('./models/session');
const homeRouter = require('./routes/homeRouter.js');
const laptopRouter = require('./routes/productRouter.js');

const app = express();

const sessionMiddleware = session.sessionMiddleware
app.use(sessionMiddleware)

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));


app.use(homeRouter);
app.use("/producthome",laptopRouter);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(rootdir,'views','404.html'))
});



const PORT = 3008;
app.listen(PORT, () => {
    console.log(`Server Running at http://localhost:${PORT}`);
});