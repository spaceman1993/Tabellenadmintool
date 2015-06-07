var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'),
	crypto = require('crypto');
var Benutzer = mongoose.model('Benutzer');

router.use(function(req, res, next) {
    console.log('Route zugriff!');
    next();
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.get('/benutzer/alle', function(req, res, next) {
	Benutzer.find()
		.exec(function (err, result) {
			if (err){
				return next(err);
			}

			res.json(result);
			return next();
	});
});

router.get('/benutzer/byID/:id', function(req, res, next) {
	var query = Benutzer.findById(req.params.id);
	query.exec(function (err, result){
	if (err){
	   	return next(err);
	}
	if (!result){
	  	return next(new Error("Kann den Benutzer nicht finden ID= " + req.params.id ));
	}
	req.json(result);
	return next();
	});
});

router.post('/benutzer/byName', function(req, res, next){	
	var query = Benutzer.findOne({name: req.body.name});
	query.exec(function(err, result){
		if(err){
			return	next(err);
		}
		res.json(result);
		return next();
	});
});

router.post('/benutzer/save', function(req, res) {	
	var newBenutzer = new Benutzer({
		name : req.body.name,
		settings : req.body.settings,
	});
	
	newBenutzer.crypt = crypto.randomBytes(16).toString('base64');
	newBenutzer.passwort = crypto.pbkdf2Sync(req.body.passwort, new Buffer(newBenutzer.crypt, 'base64'), 10000, 64).toString('base64');
	
	newBenutzer.save( function( err, result, count ){
		res.json(result);
	});
});

router.post('/benutzer/login', function(req, res, next) {	
	var query = Benutzer.findOne({name: req.body.name});
	query.exec(function(err, result){
		if(err){
			console.log("Benutzer nicht gefunden #"+req.body.name+"#" );
			res.json({"name" : "code404"});
			return	next(err);
		}
		var pass = 0;
		if(result !== null){
			pass = crypto.pbkdf2Sync(req.body.passwort, new Buffer(result.crypt, 'base64'), 10000, 64).toString('base64');
			
			if (result.passwort === pass){
				console.log("Login  #"+req.body.name+"#" );
				res.json(result);
			}else{
				console.log("Passwort stimmt nicht #"+req.body.name+"#" );
				res.json({"name" : "code403"});
			}
		}else{
			console.log("Benutzer nicht gefunden #"+req.body.name+"#" );
			res.json({"name" : "code404"});
		}
		return next();
	});
});

router.put('/Benutzer/updateSettings/byName', function(req, res, next){
	var query = Benutzer.findOne({name: req.body.name});
	query.exec(function(err, result){
		if(err){
			return	next(err);
		}
		result.settings = req.body.settings;
		result.save( function( err, result, count ){
			res.json(result);
			return next();
		});
	});
});


router.delete('/benutzer/delete/byName', function(req, res, next) {
	Benutzer.remove({
        name: req.body.name
    }, function(err, bear) {
        if (err){
        	res.send(err);        	
        }
        res.json({ message: 'Successfully deleted', "name" : req.body.name });
    });

});

module.exports = router;