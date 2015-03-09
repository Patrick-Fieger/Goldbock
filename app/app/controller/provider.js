var Provider = require('../models/provider')
, login = require('../models/onlylogin')
, random = require('randomstring')
, email = require('../emailtemplates/sender')
, role = "provider"


function create(req, res, next){
	var provider_ = req.body;
	var randomPassword = random.generate(7);
	provider_.role = "provider";
	provider_.password = randomPassword;
    
    var loginData = {
    	email : provider_.email,
		password : randomPassword,
		role : role
    }

	var emailData = {
		email: provider_.email,
		name: {
			first: provider_.firstname,
			last: provider_.lastname,
			password : randomPassword
		}
	}

	var provider = new Provider(provider_);
	provider.save(function(err) {
	  if(err) {
	    console.log(err);
	  } else {
	  	email.sendEmail(emailData,'welcomeuser')
	    console.log('user: ' + provider.email + " saved.");
	  }
	});


	// var login_ = new Login(loginData);
	// login_.save(function(err) {
	//   if(err) {
	//     console.log(err);
	//   } else {
	//     console.log('loginuser: ' + login_.email + " saved.");
	//   }
	// });
}


module.exports = {
	create : create
}