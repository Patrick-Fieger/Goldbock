var Provider = require('../models/provider'),
	mongoose = require('mongoose')


var getAvatarInfos = function (req, res, next){
	var role = capitalizeFirstLetter(req.user.role);
	var info = {
		avatar:undefined,
		fullname:"",
		role: req.user.role
	}
	eval(role).findOne({ email: req.user.email }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        res.status(404).end();
      }else {
      	if(user.avatar !== undefined){info.avatar = user.avatar}
      	info.fullname = user.firstname + ' ' + user.lastname;

      	res.send(info).status(200).end();
      }
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
	getAvatarInfos : getAvatarInfos
};