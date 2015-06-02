var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
	res.render('index', {

	});
});


/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

var mongoose = require('mongoose');
var Benutzer = mongoose.model('Benutzer');

router.get('/benutzer', function(req, res, next) {
	Benutzer.find(function(err, benutzer){
	    if(err){ return next(err); }

	    res.json(benutzer);
	  });
	});

router.post('/benutzer', function(req, res, next) {
	  var newBenutzer = new Benutzer(req.body);

	  Benutzer.save(function(err, benutzer){
	    if(err){ return next(err); }

	    res.json(benutzer);
	  });
	});

router.param('benutzer', function(req, res, next, id) {
	  var query = Benutzer.findById(id);

	  query.exec(function (err, benutzer){
	    if (err) { return next(err); }
	    if (!benutzer) { return next(new Error("Kann den Benutzer nicht finden")); }

	    req.post = benutzer;
	    return next();
	  });
	});

module.exports = router;