var email = require('../emailtemplates/sender');

function request(req,res){
	var b = req.body;

	if(b.isCompany){
		b.type = "Unternehmen"
	}else{
		b.type = "Anbieter"
	}

	b.email = "patrickfieger90@gmail.com";

	email.sendEmail(b,'request');
	res.status(200).end();
}

module.exports = {
	request: request
}