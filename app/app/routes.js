passport = require('passport')
, LocalStrategy = require('passport-local').Strategy


module.exports = function(app){
	app.post('/login', function(req, res, next) {
	  passport.authenticate('local', function(err, user, info) {
	    if (err) { return next(err); }
	    if (!user) { return res.status(401).end() }
	    req.logIn(user, { session: true }, function (err) {
	      if (err) { return next(err); }
	      return res.status(200).end();
	    });
	  })(req, res, next);
	});

	app.get('/authenticated',ensureAuthenticated, function(req, res){
	  console.log('is auth!!!!!!!!')
	})
	
	app.get('/logout', function(req, res){
	  req.logout();
	  res.redirect('/');
	});
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  console.log('isnt auth')
}