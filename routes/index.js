/**
 * Definiert, wohin der Server leiten soll, wenn die Seite aufgerufen wird
 * 
 * Erklärung: Die Raute (#) in der URL gibt an, dass alle Seiten technisch gesehen auf der Index liegen (s. HTML-Anker, vgl. Wikipedia).
 * Das heißt, der Client fragt den Server nur ein einziges Mal, wo die Index liegt.
 * Alles weitere wird auf der Index durch AngularJS (ui.route) geregelt.
 * Also muss der Server den Client nur auf die Index führen, wenn er statt einer Seite nur einen Slash (/) angibt.
 */

var express = require('express');
var router = express.Router();

/*
 * GET home page.
 */



router.get('/', function(req, res, next) {
	res.render('index', {

	});
});

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

var mongoose = require('mongoose');
var Benutzer = mongoose.model('Benutzer');

//req.header("Content-Type", "application/x-www-form-urlencoded");

router.get('/benutzer/alle', function(req, res, next) {
	Benutzer.find()
		.exec(function (err, result) {
			if (err){
				return next(err);
			}

			res.json(result);
	});
});

router.get('/benutzer/byName', function(req, res, next){
	var query = Benutzer.findOne({name: req.body.name});
	query.exec(function(err, result){
		if(err){
			return	next(err);
		}
		res.json({name : "jan"});
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

router.post('/benutzer/save', function(req, res) {	
	var newBenutzer = new Benutzer({
		name : req.body.name,
		passwort : req.body.passwort,
		einstellung : req.body.einstellung,
		crypt : req.body.crypt,
		});
		newBenutzer.save( function( err, result, count ){
		res.json(result);
	});
});

//router.delete('/benutzer/delete/byName', function(req, res, next) {

//});


module.exports = router;