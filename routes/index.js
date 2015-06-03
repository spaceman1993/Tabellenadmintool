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



// Zeug für die Datenbank, das ausgelagert werden sollte

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

var mongoose = require('mongoose');
var Benutzer = mongoose.model('Benutzer');

router.get('/alleBenutzer',function(req, res, next)
{
    Benutzer.find().exec(function(err, result)
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



// bleibt bestehen, nicht auslagern
module.exports = router;