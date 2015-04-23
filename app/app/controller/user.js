var User = require('../models/user'),
Login = require('../models/onlylogin'),
create = require('./create')

function register (req, res, next){
	var user = new User(req.body);
	create.createUser(res,user,'register_verify','user')
}


function verifyEmail(req, res, next){
	var data = req.body;

	// ABFRAGE TOKEN

	res.status(200).end();
}

module.exports = {
	register : register,
	verifyEmail : verifyEmail
}