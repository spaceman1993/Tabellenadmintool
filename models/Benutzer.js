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
	einstellung:{
		type: String,
	},
	crypt: {
		type: String
	},
});

BenutzerSchema.pre('save', function(next) {
	if (this.password && this.password.length > 6) {
 		this.crypt = crypto.randomBytes(16).toString('base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});

BenutzerSchema.methods.hashPassword = function(password) {
	if (this.crypt && password) {
		return crypto.pbkdf2Sync(password, new Buffer(this.crypt, 'base64'), 10000, 64).toString('base64');
	} else {
		return password;
	}
};

BenutzerSchema.methods.check = function(name, passwort) {
	this.Benutzer.find(function(err, benutzers) {
		if (err) {
			return console.error(err);
		}
		for ( var benutzer in benutzers) {
			if (benutzer.name === name) {
				if (benutzer.passwort === passwort) {
					return console.info("Willkomen " + benutzer.name);
					// TODO Login
					  
				}else{
					return console.error("Falsches Passwort!");
				}
			}
		}
		return console.error("Benutzer nicht vorhanden!");
	});
};


BenutzerSchema.methods.signUp = function(n, p){
	var newBenutzer = new this.Benutzer({
		name: n,
		passwort: p
		
	});
	this.Benutzer.save(function (err, newBenutzer) {
		  if (err){
			  return console.error(err);
		  }
		  return console.error("Neuer Benutzer " + newBenutzer.name);
		  
		});
	
};

mongoose.model('Benutzer', BenutzerSchema);
