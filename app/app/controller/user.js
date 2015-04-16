var User = require('../models/user'),
create = require('./create')

function register (req, res, next){
	var user = new User(req.body);
	// andere email template nehmen zur registreieung
	create.createUser(res,user,'welcomeuser','user')
}

module.exports = {
	register : register
}