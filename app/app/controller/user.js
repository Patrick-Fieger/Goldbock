var User = require('../models/user'),
Login = require('../models/onlylogin'),
Categories = require('../models/categories'),
Provider = require('../models/provider'),
Offer = require('../models/offer'),
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

function checkAdmin(req){
      if(req.user.role == "admin"){
            return req.cookies.email
      }else{
            return req.user.email
      }
}

var update = function (req, res, next){
      User.findOne({ email: checkAdmin(req) }, function(err, user) {
      if (err) { console.log(err) }
      if (!user) {
        res.status(404).end();
      }else {
            var body = req.body
            console.log(body);
            for (var key in body) {
               if(body[key] !== user[key]){
                        user[key] = body[key]
               }
            }
            user.save(function(err) {
            if(err) {
                console.log("Error");
            }
            else {
                  res.status(200).end();
            }
        });
      }
    });


	User.update({email: req.user.email}, {$set: req.body}, {upsert: true}, function(err){if(!err){res.status(200).end();}})
}


var categories = function(req, res, next){
      Categories.find({},function(err,cat){
            res.send(cat).status(200).end();
      });
}

var getAds = function(req,res){
      var return_ads = [];
      var all_ads = [];
      Offer.find({},function(err,offers){
         all_ads = offers
         // for (var i = 0; i < prov.length; i++) {
         //    for (var k = 0; k < prov[i].offers.length; k++) {
         //       .push(prov[i].offers[k])
         //    };
         // };
         Ad.find({},function(err,ads){
               return_ads = ads

               res.send({
                     ads : return_ads,
                     all_ads : all_ads
               }).status(200).end();

         }).limit(10);
      })
}


module.exports = {
	register : register,
	verifyEmail : verifyEmail,
	update : update,
      categories : categories,
      getAds : getAds
}