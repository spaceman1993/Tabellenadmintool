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
					// TODO Login
				}
			}
		}
	});
}

mongoose.model('Passwort', benutzerSchema);