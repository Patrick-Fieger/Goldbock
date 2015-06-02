var Provider = require('../models/provider'),
	User = require('../models/user')
	mongoose = require('mongoose'),
	uuid = require('uuid'),
    formidable = require('formidable'),
    fs = require('fs-extra'),
    newLocation = 'public/uploads/',
    options = require('../../config/uploads.js'),
    gm = require('gm');


var getAvatarInfos = function (req, res, next){
	var role = capitalizeFirstLetter(req.user.role);
	var info = {
		avatar:undefined,
		fullname:"",
		role: req.user.role
	}
	eval(role).findOne({ email: req.user.email }, function(err, user) {
      if (err) { console.log(err) }
      if (!user) {
        res.status(404).end();
      }else {
      	if(user.avatar !== undefined){info.avatar = user.avatar}
      	info.fullname = user.firstname + ' ' + user.lastname;

      	res.send(info).status(200).end();
      }
    });
}

var profile = function(req, res, next){
	var role = capitalizeFirstLetter(req.user.role);
	// console.log(role)
	eval(role).findOne({ email: req.user.email }, function(err, user) {
      if (err) { console.log(err) }
      if (!user) {
        res.status(404).end();
      }else {
      	res.send(user).status(200).end();
      }
    });
}

var avatar = function(req, res, next){
	var _uuid = uuid.v4();
	var data = req.body.data
	data = data.replace(/^data:image\/\w+;base64,/, "");

	var bitmap = new Buffer(data, 'base64');
	folderNameByEmail = emailToFolder(req.user.email)
	var filename = _uuid + '.jpg'

	fs.writeFileSync(filename, bitmap)
	fs.move(filename, 'public/uploads/' + folderNameByEmail + filename, function(err) {
		if (err) {
		    console.error(err);
		} else {
			resizeAvatar(req,res,folderNameByEmail,filename)
		}
    });
}


function updatePassword (req, res, next){
	var password = req.body.old;
	Login.findOne({ email: req.user.email }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return false;
      }

		user.comparePassword(password, function(err, isMatch) {
		  if (isMatch) {
		    user.password = req.body.new;
		    user.save(function (err) {
			    if(err) {
			        console.error(err);
			    }else{
			    	res.status(200).end();
			    }
			});
		  } else {
		    console.log('NOOOO!')
		  }
		});
    });
}


function resizeAvatar(req,res,folderNameByEmail,filename){
	var path = 'public/uploads/' + folderNameByEmail + filename;
	var role = capitalizeFirstLetter(req.user.role);

	var path_ = path.split(".");

	var avatar = {
		big : path_[0] + '_big.' + path_[1],
		small : path_[0] + '_small.' + path_[1]
	}
	
	gm(path)
	.resize(200, 200)
	.autoOrient()
	.write(avatar.big, function (err) {
	  if (!err){
	  	gm(path)
	  	.resize(70, 70)
		.autoOrient()
		.write(avatar.small, function (err) {
		  if (!err){
			fs.remove(path, function (err) {
			  if (err) throw err;
			  eval(role).findOne({email: req.user.email}, function (err, user) {
			      if(user.avatar!==undefined){
			      	deletePrevAvatar(user.avatar)
			      }
			      user.avatar = avatar;
			      user.save(function (err) {
			          if(err) {
			              console.error('ERROR!');
			          }else{
			          	res.send(avatar).status(200).end();
			          }
			      });
			  });
			});
		  }
		});
	  }
	});
}

function deletePrevAvatar(avatars){
	if(avatars !== undefined){
		if(avatars.big !== "" && avatars.big !== undefined && avatars.small !== "" && avatars.small !== undefined){
			fs.remove(avatars.big, function (err) {});
			fs.remove(avatars.small, function (err) {});
		}
	}
	
}

function emailToFolder(email){
	return email.replace(/\./g, '').replace(/\@/g, '') + '/';
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
	getAvatarInfos : getAvatarInfos,
	profile : profile,
	updatePassword : updatePassword,
	avatar : avatar
};