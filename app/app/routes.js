var pass = require('../config/passport')
	, provider = require('./controller/provider')
	, admin = require('./controller/admin')
	, all = require('./controller/all')

module.exports = function(app){
	app.post('/login', pass.login);
	app.post('/logout', pass.logout);
	app.post('/createprovider', pass.isAuthenticatedToMakeRequest , admin.createProvider);
	app.post('/provider/upload/offer/title', pass.isAuthenticatedToMakeRequest , provider.uploadOfferTitleImage);
	app.post('/provider/upload/offer/images', pass.isAuthenticatedToMakeRequest , provider.uploadOfferImages);
	app.post('/provider/upload/offer/video', pass.isAuthenticatedToMakeRequest , provider.uploadOfferVideo);
	app.post('/provider/upload/offer/data', pass.isAuthenticatedToMakeRequest , provider.uploadOfferData);
	app.post('/provider/edit/offer/data', pass.isAuthenticatedToMakeRequest , provider.updateOfferData);

	

	app.get('/offers', pass.isAuthenticatedToMakeRequest , provider.offers);
	app.delete('/offer', pass.isAuthenticatedToMakeRequest , provider.deleteOffer);
	app.delete('/edit/offer', pass.isAuthenticatedToMakeRequest , provider.deleteOfferData);
	app.get('/offer', pass.isLoggedInNext , provider.offer);
	app.post('/update/provider', pass.isAuthenticatedToMakeRequest , provider.update);
	app.post('/update/avatar', pass.isAuthenticatedToMakeRequest , all.avatar);
	app.get('/upload/progress', pass.isAuthenticatedToMakeRequest , provider.progress);
	app.get('/profile', pass.isAuthenticatedToMakeRequest , all.profile);
	app.get('/avatarinfos', pass.isAuthenticatedToMakeRequest , all.getAvatarInfos);
	app.get('/authenticated',pass.isAuthenticatedToSeeContent);
	app.get('/isloggedin', pass.isLoggedIn);
}