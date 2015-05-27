var create = require('./create'),
Provider = require('../models/provider')
User = require('../models/user')
Company = require('../models/company')

function createProvider(req, res, next){
	var provider = new Provider(req.body);
	create.createUser(res,provider,'welcomeuser','provider')
}

var getProviders = function(req, res, next){
      res.status(200).end();
}

var getUsers = function(req, res, next){
      
}

var getCompanys = function(req, res, next){
      
}

module.exports = {
	createProvider : createProvider,
	getProviders : getProviders,
	getUsers : getUsers,
	getCompanys : getCompanys
}