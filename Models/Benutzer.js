/**
 * 
 */
var mongoose = require('mongoose');

var benutzerSchema = mongoose.Schema({
	id: String,
    name: String,
    passwort: String,
    einstellung: Int8Array
    
});

mongoose.model('Passwort', benutzerSchema);