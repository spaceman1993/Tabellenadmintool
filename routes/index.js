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

module.exports = router;