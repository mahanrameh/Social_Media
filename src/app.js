const express = require("express");
const path = require("path");
const flash = require("express-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const authRouter = require("./modules/auth/auth.route");
const postRouter = require("./modules/post/post.route");
const pageRouter = require("./modules/page/page.route");
const { setHeaders } = require("./middlewares/headers");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

//* bodyParser
app.use(express.urlencoded({limit:'50mb', extended: true}));
app.use(express.json({limit:'50mb'}));

//* CookieParser
app.use(cookieParser());

//* Cors Policy
app.use(setHeaders);

//* Express-Flash
app.use(
    session({
        secret: 'Secret Key',
        resave: false,
        saveUninitialized: false
    }));
app.use(flash());


//* Static Folders
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/fonts', express.static(path.join(__dirname, 'public/fonts')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

//* Template Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//* Routes
app.get('/', (req, res) => {
    return res.render('index');
});
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/page', pageRouter);

//* Error Handler
app.use((req, res) => {
    console.log('this path is not found', req.path);
    return res.status(404).json({
        message: '404! path not found. please check path/method'
    });
});



module.exports = app;