/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');
var http = require('http');
var mongoose = require('mongoose');
var io = require('socket.io');

mongoose.connect('mongodb://localhost/Schule');

require('./models/Benutzer');

var routes = require('./routes');
var user = require('./routes/user');

var app = express();

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
	console.log("Datenbankverbindung erfolgt!");
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app);

var io = io.listen(server);

io.sockets.on('connection', function(socket) {
	socket.on('createNote', function(data) {
		socket.broadcast.emit('onNoteCreated', data);
	});

	socket.on('updateNote', function(data) {
		socket.broadcast.emit('onNoteUpdated', data);
	});

	socket.on('moveNote', function(data){
		socket.broadcast.emit('onNoteMoved', data);
	});

	socket.on('deleteNote', function(data){
		socket.broadcast.emit('onNoteDeleted', data);
	});
});

server.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;