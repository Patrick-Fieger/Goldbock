var User = require('../models/user'),
Login = require('../models/onlylogin'),
Categories = require('../models/categories'),
Ad = require('../models/ad'),
create = require('./create'),
Email = require('../emailtemplates/sender')

function register (req, res, next){
	var user = new User(req.body);
	create.createUser(res,user,'register_verify','user')
}


function verifyEmail(req, res, next){
	var data = req.body;
	
	Login.findOne({ "emailVerificationToken": data.token }, function(err, user) {
      if (err) { console.log(err) }

      if(user){
      	var emailFromUser = user.email
      	Login.update({email: user.email}, {$set: { emailVerificationToken: "" }}, {upsert: true}, function(err){
      		if(!err){
      			Email.sendEmail({email:emailFromUser},'register_complete') 
      			res.status(200).end();		
      		}
      	})
      }
    });	
}

var update = function (req, res, next){
	User.update({email: req.user.email}, {$set: req.body}, {upsert: true}, function(err){if(!err){res.status(200).end();}})
}


var categories = function(req, res, next){
      Categories.find({},function(err,cat){
            res.send(cat).status(200).end();
      });
}

var getAds = function(req,res){
      var return_ads = [];

      Ad.find({},function(err,ads){
            for (var i = 0; i < 10; i++) {
                  
                  if(ads[0].ads[i]){
                        return_ads.push(ads[0].ads[i]);
                  }
                  
            };

            res.send({
                  ads : return_ads
            }).status(200).end();

      });
}


module.exports = {
	register : register,
	verifyEmail : verifyEmail,
	update : update,
      categories : categories,
      getAds : getAds
}