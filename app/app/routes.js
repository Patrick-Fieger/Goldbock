var pass = require('../config/passport')
	, provider = require('./controller/provider')
	, user = require('./controller/user')
	, admin = require('./controller/admin')
	, all = require('./controller/all')
	, chat = require('./controller/chat')
	, offer = require('./controller/offer')
	, request = require('./controller/request')

module.exports = function(app){
	app.post('/login', pass.login);
	app.post('/logout', pass.logout);
	app.post('/forgot', pass.forgot);
	app.post('/register', user.register);
	app.post('/request', request.request);


	app.post('/verify/email', user.verifyEmail);
	app.post('/update/forgot/password', pass.updatePassword);
	app.post('/createprovider', pass.isAuthenticatedToMakeRequest , admin.createProvider);
	app.post('/upload/offer/images', pass.isAuthenticatedToMakeRequest , offer.uploadOfferImages);
	app.post('/upload/offer/video', pass.isAuthenticatedToMakeRequest , offer.uploadOfferVideo);
	app.post('/upload/offer/data', pass.isAuthenticatedToMakeRequest , offer.uploadOfferData);
	app.get('/upload/progress', pass.isAuthenticatedToMakeRequest , offer.progress);

	app.post('/change/offer/state', pass.isAuthenticatedToMakeRequest , offer.changeOfferState);


	app.get('/getoffersuser', pass.isAuthenticatedToMakeRequest , offer.getoffersuser);
	app.get('/offer', pass.isLoggedInNext , offer.getoffer);
	app.post('/add/comment', pass.isAuthenticatedToMakeRequest , offer.addComment);





	app.post('/add/advertising', pass.isAuthenticatedToMakeRequest , provider.addAdvertising);



	app.post('/favorites', pass.isAuthenticatedToMakeRequest , provider.favorites);
	app.post('/clear/upload', provider.clearProgress);
	app.get('/offers', pass.isAuthenticatedToMakeRequest , provider.offers);
	app.delete('/offer', pass.isAuthenticatedToMakeRequest , offer.deleteOffer);
	//app.delete('/edit/offer', pass.isAuthenticatedToMakeRequest , provider.deleteOfferData);

	app.post('/update/provider', pass.isAuthenticatedToMakeRequest , provider.update);
	app.post('/update/user', pass.isAuthenticatedToMakeRequest , user.update);
	app.get('/categories', pass.isAuthenticatedToMakeRequest , user.categories);

	app.get('/adds', pass.isAuthenticatedToMakeRequest , user.getAds);


	app.get('/post/links',pass.isAuthenticatedToMakeRequest, all.postSuggestion)
	app.get('/getProviders', pass.isAuthenticatedToMakeRequest , admin.getProviders)
	app.get('/getOffers', pass.isAuthenticatedToMakeRequest , admin.getOffers)
	app.get('/getUsers', pass.isAuthenticatedToMakeRequest , admin.getUsers)
	app.get('/getCompanys', pass.isAuthenticatedToMakeRequest , admin.getCompanys)
	app.post('/admin/update/profile', pass.isAuthenticatedToMakeRequest , admin.updateProfile);
	app.post('/admin/update/categories', pass.isAuthenticatedToMakeRequest , admin.updateCategories);
	app.post('/toggle/activate', pass.isAuthenticatedToMakeRequest , admin.toggleActivate);
	app.post('/update/avatar', pass.isAuthenticatedToMakeRequest , all.avatar);
	app.post('/update/password', pass.isAuthenticatedToMakeRequest , all.updatePassword);
	app.get('/profile', pass.isAuthenticatedToMakeRequest , all.profile);
	app.get('/avatarinfos', pass.isAuthenticatedToMakeRequest ,pass.isNotAdmin, all.getAvatarInfos);
	app.get('/authenticated',pass.isAuthenticatedToSeeContent);
	app.get('/isloggedin', pass.isLoggedIn);
	app.get('/isadmin', pass.isAdmin);

	app.get('/alloffers',pass.isAuthenticatedToMakeRequest,all.allOffers);

	app.get('/unreadedmessages',pass.isAuthenticatedToMakeRequest,chat.unreadedmessages);

	app.post('/post/image/upload',pass.isAuthenticatedToMakeRequest,all.uploadPostImage);
	app.post('/post/add/comment',pass.isAuthenticatedToMakeRequest,all.addCommentPost);


	app.get('/getallusers', pass.isAuthenticatedToMakeRequest, all.getAllUsers)

}