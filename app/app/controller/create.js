var Provider = require('../models/provider')
, Login = require('../models/onlylogin')
, User = require('../models/user')
, email = require('../emailtemplates/sender')
, random = require('randomstring')
, uuid = require('uuid')

function createUser(res,data,emailtype,roletype){
	var roleCap = roletype.charAt(0).toUpperCase() + roletype.slice(1);
	var saveData = data;
	var uuid_ = uuid.v4();
	var universal_user_id = uuid.v4();
	saveData.role = roletype;
	var password = saveData.password;
	if(password == undefined){
		password = random.generate(7);
	}

	delete saveData['password'];
	delete saveData['role'];

	var loginData = {
    	email : saveData.email,
		password : password,
		role : roletype,
		id__ : universal_user_id
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

	if(roletype == 'user'){
		loginData.emailVerificationToken = uuid_;
		emailData.name.token = 'http://goldbock.de/#/verify/email/' + uuid_;
	}

	saveData.id = universal_user_id;

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