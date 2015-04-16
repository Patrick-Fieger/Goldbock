var create = require('./create'),
Provider = require('../models/provider')

function createProvider(req, res, next){
	var provider = new Provider(req.body);
	create.createUser(res,provider,'welcomeuser','provider')
}

module.exports = {
	createProvider : createProvider
}