pass = require('../config/passport');

module.exports = function(app){
	app.post('/login', pass.login);
	app.get('/authenticated',pass.isAuthenticatedToSeeContent);
	app.get('/logout', function(req, res){req.logout()});
}

//var email = require('./emailtemplates/sender')
//var randomstring = require("randomstring");
//email.sendEmail({email: 'patrickfieger90@gmail.com',name: {  first: 'Hans',  last: 'Müller', password : randomstring.generate(7)}},'welcomeuser');