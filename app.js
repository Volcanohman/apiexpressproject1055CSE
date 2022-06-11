var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')();
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
dotenv.config();


var profileRouter = require('./routes/profile');
var postsRouter = require('./routes/posts');
var authRouter = require('./routes/auth');
var followsRouter = require('./routes/follows');

var app = express();

app.use(logger('dev'));
app.use('static', express.static('./static'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 15 minutes
    max: 60, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use('/api', cors, apiLimiter);
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/posts', postsRouter);
app.use('/api/follows', followsRouter);

module.exports = app;
