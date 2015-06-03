/**
 * Server-Einstellungen
 */


/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var configuration = require('./config');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
mongoose.connect(configuration.mongodbURL);

require('./models/Benutzer');

var mainRoutes = require('./routes/index');
var user = require('./routes/user');

var app = express();

// all environments
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(cookieParser());

app.use('/', mainRoutes);
//app.use('/tableURL', tableRoutes);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;


//mongo auslagern
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
	console.log("Datenbankverbindung erfolgt!");
});