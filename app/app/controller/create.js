var Provider = require('../models/provider')
, Login = require('../models/onlylogin')
, User = require('../models/user')
, email = require('../emailtemplates/sender')
, random = require('randomstring')



function createUser(res,data,emailtype,roletype){
	var roleCap = roletype.charAt(0).toUpperCase() + roletype.slice(1);
	var saveData = data;
	saveData.role = roletype;
	var password = saveData.password;
	if(password == undefined){
		password = random.generate(7);
	}

	delete saveData['password']; 

	var loginData = {
    	email : saveData.email,
		password : password,
		role : roletype
    }
    var emailData = {
		email: saveData.email,
		name: {
			first: saveData.firstname,
			last: saveData.lastname
		}
	}

	if(roletype == 'provider' || roletype == 'company'){
		emailData.name.password = password
	}
	
	eval(roleCap).create(saveData,function(err, roletype){
		if(err){
			console.log(err)
			res.status(500).end();
		}else{
			Login.create(loginData, function (err, login) {
				if(err){
					res.status(500).end();
				}else{
					email.sendEmail(emailData,emailtype);
					res.status(200).end();
				}
			});
		}
	});
}


module.exports = {
	createUser : createUser
}