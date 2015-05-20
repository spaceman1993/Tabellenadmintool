/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');
var http = require('http');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/Schule');

require('./models/Benutzer');

var routes = require('./routes/index');
var user = require('./routes/user');

var app = express();

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
	console.log("Datenbank verbindung erfolgt!");
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes);
app.get('/users', user);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
