var pass = require('../config/passport')
	, provider = require('./controller/provider')
	, admin = require('./controller/admin')
	, all = require('./controller/all')

module.exports = function(app){
	app.post('/login', pass.login);
	app.post('/createprovider', pass.isAuthenticatedToMakeRequest , admin.createProvider);
	app.post('/provider/upload/offer/images', pass.isAuthenticatedToMakeRequest , provider.uploadOfferImages);
	app.post('/provider/upload/offer/video', pass.isAuthenticatedToMakeRequest , provider.uploadOfferVideo);
	app.get('/upload/progress', pass.isAuthenticatedToMakeRequest , provider.progress);

	app.get('/avatarinfos', pass.isAuthenticatedToMakeRequest , all.getAvatarInfos);

	app.get('/authenticated',pass.isAuthenticatedToSeeContent);
	app.get('/logout', function(req, res){req.logout()});
	app.get('/isloggedin', pass.isLoggedIn);
}