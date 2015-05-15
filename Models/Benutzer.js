/**
 * 
 */
var mongoose = require('mongoose');

var benutzerSchema = mongoose.Schema({
	id : String,
	name : String,
	passwort : String,
	einstellung : Array
});

benutzerSchema.methods.check = function(name, passwort) {
	this.Benutzer.find(function(err, benutzers) {
		if (err) {
			return console.error(err);
		}
		for ( var benutzer in benutzers) {
			if (benutzer.name === name) {
				if (benutzer.passwort === passwort) {
					  console.error("Willkomen " + benutzer.name);
					// TODO Login
				}
			}
		}
	});
};


benutzerSchema.methods.signUp = function(n, p){
	var newBenutzer = new this.Benutzer({
		name: n,
		passwort: p
		
	});
	this.Benutzer.save(function (err, newBenutzer) {
		  if (err){
			  return console.error(err);
		  }
		  console.error("Neuer Benutzer " + newBenutzer.name);
		});
	
};

mongoose.model('Passwort', benutzerSchema);