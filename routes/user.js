var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
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
		passwort : req.body.passwort,
		settings : req.body.settings,
		crypt : req.body.crypt,
	});
	newBenutzer.save( function( err, result, count ){
		res.json(result);
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