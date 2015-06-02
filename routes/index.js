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


router.get('/alleBenutzer',function(req, res, next)
		{
		    benutzer.find().exec(function(err, result)
		    {
		        if(err)
		        {
		            return next(err);
		        }

		        res.json(result);
		    });        
		});

router.get('/benutzer', function(req, res, next){
	Benutzer.find({name: req.body.name})
		.exec(function(err, result){
			if(err) return next(err);
			res.json(result);
		});
});

router.get('/benutzer/ID/:id', function(req, res, next) {
	  var query = Benutzer.findById(req.params.id);

	  query.exec(function (err, benutzer){
	    if (err) { return next(err); }
	    if (!benutzer) { return next(new Error("Kann den Benutzer nicht finden")); }

	    req.post = benutzer;
	    return next();
	  });
	});

router.post('/benutzer', function(req, res, next) {
	  var newBenutzer = new Benutzer(req.body.name, req.body.pass, req.body.ein, req.body.crypt);

	  Benutzer.save(function(err, benutzer){
	    if(err){ return next(err); }
	    
	    res.json(benutzer);
	  });
	});

//router.delete(modelRequestPath + '/:id', function(req, res, next) {
//	Benutzer.findByIdAndRemove(req.params.id, function (err)
//    {
//        if (err)
//        {
//            console.log(err);
//        }
//    });
//});

module.exports = router;