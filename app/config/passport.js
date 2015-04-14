  passport = require('passport')
, moment = require('moment')
, LocalStrategy = require('passport-local').Strategy
, Login = require('../app/models/onlylogin')
, bcrypt = require('bcrypt')
, allowedpath = require('./allowedpath')
, allowedrequest = require('./allowedrequest')
, email = require('../app/emailtemplates/sender')

passport.serializeUser(function(user, done) {
  done(null, {
    id: user.id,
    email: user.email,
    role : user.role
  });
});

passport.deserializeUser(function(id, done) {
  Login.findById(id.id, function (err, user) {
    done(err, {
      id: user.id,
      email: user.email,
      role : user.role
    });
  });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    Login.findOne({ email: email }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }

      if (!bcrypt.compareSync(password,user.password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

var login = function(req, res, next){
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.status(401).end() }
    req.logIn(user, { session: true }, function (err) {
      if (err) { return next(err); }
      return res.send(getLoginRedirect(user.role)).status(200).end();
    });
  })(req, res, next);
}

var logout = function(req, res, next){
  req.logout();
  res.status(200).end();
}

function forgot (req, res, next){
    var tomorrow = moment().format(),
    token = uuid.v4();

    var emailData = {
      email: req.body.email,
      link : 'http://goldbock.de/forgot/' + token
    }

    Login.update({email : req.body.email},
      { 
        $set: {
          resetPasswordToken : token,
          resetPasswordExpires : tomorrow
        }
      },
      function(err, affected){
        if(err){

        }else{
          email.sendEmail(emailData,'forgot')
          res.send(200).end();
        }
      });
}

function updatePassword(req, res, next){
  Login.findOne({ resetPasswordToken : req.body.token }, function(err, user) {
    if (err) { return done(err); }
    if (!user) {
      res.status(404).end();
    }else{
      if(moment().diff(user.resetPasswordExpires, 'days') == 0){
        user.password = req.body.password;
        user.resetPasswordToken = "";
        user.resetPasswordExpires = "";
        user.save(function(err) {
            if(err) {
                console.log("Error");
            }
            else {
              res.status(200).end();
              var emailData = {
                email: user.email
              }
              email.sendEmail(emailData,'forgot_complete')
            }
        });
      }else{
        console.log('expired!!!!')
      }
    }
  });
}

function getLoginRedirect(role){
  return allowedpath[role][0]
}

function isLoggedIn(req, res, next){
  if (req.user) {
      res.status(200).end();
  } else {
      res.status(401).end();
  }
}

function isLoggedInNext(req, res, next){
  if (req.user) {
      return next();
  } else {
      res.status(401).end();
  }
}

var isAuthenticatedToSeeContent = function (req, res, next) {
  var path;
  if(req.query.path.split('/')[1] == "offer" || req.query.path.split('/')[1] == "edit"){
    path = '/' + req.query.path.split('/')[1]
  }else{
    path = req.query.path
  }

  if (req.isAuthenticated() && allowedpath[req.user.role].indexOf(path) > -1)
    res.status(200).end();
  else
    res.status(401).end();
}

var isAuthenticatedToMakeRequest = function (req, res, next) {
  var path = req._parsedOriginalUrl.path;
  var split = path.indexOf('?');
  path = path.substring(0, split != -1 ? split : path.length);

  if (req.isAuthenticated() && allowedrequest[req.user.role].indexOf(path) > -1)
    return next();
  else
    res.status(401).end();
}


module.exports = {
  login : login,
  logout : logout,
  forgot : forgot,
  isAuthenticatedToSeeContent: isAuthenticatedToSeeContent,
  isAuthenticatedToMakeRequest: isAuthenticatedToMakeRequest,
  isLoggedIn : isLoggedIn,
  isLoggedInNext : isLoggedInNext,
  updatePassword : updatePassword
}