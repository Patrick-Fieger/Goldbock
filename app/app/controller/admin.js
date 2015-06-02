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

var updateProfile = function(req, res, next){
    var role = capitalizeFirstLetter(req.body.role)
    eval(role).findOne({email: req.body.email},function(err,user){
        user.firstname = req.body.firstname
        user.lastname = req.body.lastname
        user.company = req.body.company
        user.city = req.body.city
        user.street = req.body.street
        user.zip = req.body.zip
        user.tel = req.body.tel
        user.save(function(err) {
            if(err) {
                console.log("Error");
            }
            else {
                res.status(200).end();
            }
        });
    });

}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
	createProvider : createProvider,
	getProviders : getProviders,
	getUsers : getUsers,
	getCompanys : getCompanys,
    updateProfile : updateProfile
}