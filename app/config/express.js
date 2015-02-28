   express = require('express')
 , morgan = require('morgan')
 , cookieParser = require('cookie-parser')
 , bodyParser = require('body-parser')
 , session = require('express-session')
 , uuid = require('uuid')
 , passport = require('passport');


module.exports = function(app){
	app.use(morgan('dev'));
	app.use(cookieParser());
	app.use(bodyParser.json());
	app.use(session({
	  genid: function(req) {return uuid.v4();},
	  secret: 'goldbockemployees4ever'
	}))
	
	app.use(passport.initialize());
	app.use(passport.session());
}