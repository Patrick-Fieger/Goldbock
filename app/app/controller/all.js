var Provider = require('../models/provider'),
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
	var form = new formidable.IncomingForm(options.avatar),
	folderNameByEmail = emailToFolder(req.user.email)

    form.on('end', function() {
    	var _uuid = uuid.v4();
    	var extension = this.openedFiles[0].name.split('.').pop();
		var newFilename = _uuid + '.' + extension
		, temp_path = this.openedFiles[0].path

		fs.move(temp_path, newLocation + folderNameByEmail + newFilename, function(err) {
            if (err) {
                console.error(err);
            } else {
            	resizeAvatar(req,res,folderNameByEmail,_uuid,extension)
            }
        });
	});

	form.parse(req, function(err, fields, files) {
        if (err) console.log(err);
    });
}


function resizeAvatar(req,res,folderNameByEmail,_uuid,extension){
	var path = newLocation + folderNameByEmail + _uuid + '.' + extension;
	var role = capitalizeFirstLetter(req.user.role);
	var avatar = {
		big : newLocation + folderNameByEmail + _uuid + '_big.' + extension,
		small : newLocation + folderNameByEmail + _uuid + '_small.' + extension
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
			          	console.log('new')
			          	console.log(avatar)
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
	console.log('delete')
	console.log(avatars)
	fs.remove(avatars.big, function (err) {});
	fs.remove(avatars.small, function (err) {});
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
	avatar : avatar
};