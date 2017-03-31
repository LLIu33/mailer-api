/**
 * Import core modules
 */
const express = require('express');
const session = require('express-session');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportConfig = require('./config/passport'); // all passport configuration and provider logic

// enable prod for faster renders
// enableProdMode();

/**
 * Import main route module
 */
var routes = require('./routes');

const app = express();
const ROOT = path.join(path.resolve(__dirname, '..'));

/**
 * View engine setup
 */
// Express View
// app.engine('.html', expressEngine);
// app.set('views', __dirname);
// app.set('view engine', 'html');

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

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
// app.use('/client', express.static(__dirname + './../client'));
app.use('/node_modules', express.static(path.join(ROOT, '../node_modules')));
// app.use('/dist', express.static(path.join(ROOT, '../dist')));

// app.use('/assets', express.static(path.join(ROOT, './client/assets')));
// app.use(favicon(path.join(__dirname, '../client', 'assets/favicon.ico')));

/**
 * Link main route module to app
 */
app.use('/', routes);

/**
 * Extraneous handler functions
 */

// // Catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // Error handlers

// // Development error handler will print stack trace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// // Production error handler will not leak stacktrace to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });

module.exports = app;
