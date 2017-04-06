var express = require('express');
var session = require('express-session');
var path = require('path');
// const favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var passportConfig = require('./config/passport'); // all passport configuration and provider logic

var routes = require('./routes');

var app = express();
var ROOT = path.join(path.resolve(__dirname, '..'));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'my_precious'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

// Serve static files
app.use(express.static(ROOT, { index: false }));
app.use('/node_modules', express.static(path.join(ROOT, '../node_modules')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
/**
 * Link main route module to app
 */
app.use('/', routes);

module.exports = app;
