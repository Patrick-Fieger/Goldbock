var pass = require('../config/passport')
	, provider = require('./controller/provider')

module.exports = function(app){
	app.post('/login', pass.login);
	app.post('/createprovider', pass.isAuthenticatedToMakeRequest , provider.create);
	app.get('/authenticated',pass.isAuthenticatedToSeeContent);
	app.get('/logout', function(req, res){req.logout()});
}