var create = require('./create')
    , uuid = require('uuid')
    , Provider = require('../models/provider')
    , Offer = require('../models/offer')
    , User = require('../models/user')
    , Company = require('../models/company')
    , Categories = require('../models/categories')

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

var getOffers = function(req, res, next){
    Offer.find({},function(err,offer){
        if(!err){
            res.send(offer).status(200).end();
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
    var role = capitalizeFirstLetter(req.body.role);
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
                console.log(err);
            }
            else {
                res.status(200).end();
            }
        });
    });

}


function updateCategories (req, res, next){
    var d = req.body;

    Categories.remove({}, function(err) {
        for (var i = 0; i < d.length; i++) {
            if(d[i].id == null){
                    d[i].id = uuid.v4();
                    d[i].href = d[i].category.replace(/\//,'').replace(/\s/g,'-').replace('ö','oe').replace('--','-').replace('-und-','-').toLowerCase();
            }
        }
        Categories.create(d,function(err){
            if(!err){
                res.status(200).end();
            }
        });
    });
}

function toggleActivate(req,res){
    Login.findOne({email : req.body.email},function(err,user){
      if(user.deactivated == undefined){
        user.deactivated = true;
      }else{
        user.deactivated = !user.deactivated
      }

      user.save(function(err){
        if(!err){
            res.status(200).end();
        }else{
            console.log(err)
        }
      });


    });

    var role = capitalizeFirstLetter(req.body.role);
    eval(role).findOne({ email: req.body.email }, function(err, user_) {
        if(user_.deactivated == undefined){
            user_.deactivated = true;
        }else{
            user_.deactivated = !user_.deactivated
        }
        user_.save();
    });
}



function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
	createProvider : createProvider,
	getProviders : getProviders,
	getUsers : getUsers,
    getOffers : getOffers,
	getCompanys : getCompanys,
    updateProfile : updateProfile,
    updateCategories : updateCategories,
    toggleActivate : toggleActivate
}