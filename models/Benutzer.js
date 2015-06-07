'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

/**
 * Benutzer Schema
 */

var BenutzerSchema = new Schema({
	name:{
		type: String,
		trim: true,
	},
	passwort:{
		type: String,
		trim: true,
	},
	settings:{
		type: Object,
	},
	crypt: {
		type: String
	},
});

BenutzerSchema.post('save', function(doc) {
	  console.log('%s has been saved', doc.name);
});

mongoose.model('Benutzer', BenutzerSchema);