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
        return done(null, false, { message: 'Diese Email existiert nicht' });
      }

      if(user.deactivated){
        return done(null, false, { message: 'Sie wurden von unserem System deaktiviert oder Sie haben sich löschen lassen!' });
      }

      if (!bcrypt.compareSync(password,user.password)) {
        return done(null, false, { message: 'Das Passwort ist nicht korrekt' });
      }
      return done(null, user);
    });
  }
));

var login = function(req, res, next){
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.status(401).end() }

    if(user.emailVerificationToken !== "" && user.emailVerificationToken !== undefined){
      res.send("Sie müssen erst ihre Email Verifizieren um sich einzuloggen").status(401).end();
    }else{
      req.logIn(user, { session: true }, function (err) {
        if (err) { return res.send(err.message).status(401).end();}
        return res.send(getLoginRedirect(user.role)).status(200).end();
      });
    }



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

function isAuthenticatedToSeeContent(req, res, next) {
  var path = req.query.path.split('/')[1];
  if(path == "offer" || path == "edit" || path == "verify" || path == "offers"){
    path = '/' + req.query.path.split('/')[1]
  }else{
    path = req.query.path
  }

  if (req.isAuthenticated() && allowedpath[req.user.role].indexOf(path) > -1)
    res.status(200).send(req.user.role).end();
  else
    res.status(401).end();
}

function isNotAdmin(req,res,next){
  if(req.user.role !== 'admin'){
    return next()
  }
}

function isAuthenticatedToMakeRequest(req, res, next) {
  var path = req.url;
  var split = path.indexOf('?');
  path = path.substring(0, split != -1 ? split : path.length);
  if (req.isAuthenticated() && allowedrequest[req.user.role].indexOf(path) > -1)
    return next();
  else
    res.status(401).end();
}

function isAdmin(req, res, next){
  if(req.user){
    if(req.user.role == "admin"){
      res.send({admin: true}).status(200).end();
    }else{
      res.send({admin: false}).status(200).end();
    }
  }else{
      res.send({admin: false}).status(200).end();
    }

}

module.exports = {
  login : login,
  logout : logout,
  forgot : forgot,
  isAuthenticatedToSeeContent : isAuthenticatedToSeeContent,
  isAuthenticatedToMakeRequest : isAuthenticatedToMakeRequest,
  isLoggedIn : isLoggedIn,
  isLoggedInNext : isLoggedInNext,
  updatePassword : updatePassword,
  isNotAdmin : isNotAdmin,
  isAdmin : isAdmin
}