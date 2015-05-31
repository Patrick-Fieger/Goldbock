var create = require('./create'),
Provider = require('../models/provider')
User = require('../models/user')
Company = require('../models/company')

function createProvider(req, res, next){
	var provider = new Provider(req.body);
	create.createUser(res,provider,'welcomeuser','provider')
}

var getProviders = function(req, res, next){
    Provider.find({},function(err,provider){
    	if(!err){
    		res.send(provider).status(200).end();
    	}
    }); 
}

var getUsers = function(req, res, next){
    User.find({},function(err,user){
    	if(!err){
    		res.send(user).status(200).end();
    	}
    });  
}

var getCompanys = function(req, res, next){
    Company.find({},function(err,companies){
    	if(!err){
    		res.send(companies).status(200).end();
    	}
    });  
}

module.exports = {
	createProvider : createProvider,
	getProviders : getProviders,
	getUsers : getUsers,
	getCompanys : getCompanys
}