var Provider = require('../models/provider'),
	User = require('../models/user'),
	Post = require('../models/post')
	mongoose = require('mongoose'),
	uuid = require('uuid'),
    formidable = require('formidable'),
    fs = require('fs-extra'),
    newLocation = 'public/uploads/',
    options = require('../../config/uploads.js'),
    google = require('google')
    gm = require('gm');

	google.resultsPerPage = 5

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

var postSuggestion = function(req,res){
	var search = req.query.text;
	var links_ = [];

	Post.find({ "link": { "$regex": search, "$options": "i" } },function(err,docs) {
		for (var i = 0; i < docs.length; i++) {
			links_.push(docs[i].link);
		}
		res.send(links_).status(200).end();
    }).limit(5);
}

function uniq(a) {
	if(a.length > 1){
		return a.sort().filter(function(item, pos, ary) {
        	return !pos || item != ary[pos - 1];
    	})
	}else{
		return a;
	}
}

var profile = function(req, res, next){
	var role = capitalizeFirstLetter(req.user.role);

	if(role !== "Admin"){
		eval(role).findOne({ email: req.user.email }, function(err, user) {
		  if (err) { console.log(err) }
		  if (!user) {
		    res.status(404).end();
		  }else {
		  	if(role == "User"){
		  		if(user.liked.length !== 0){
		  			Provider.find({}, 'offers -_id lastname firstname', function(err, results){
		  				if(err) return next(err);
		  				var likedposts = [];


		  				for (var i = 0; i < results.length; i++) {
		  					for (var k = 0; k < results[i].offers.length; k++) {
		  						if(user.liked.indexOf(results[i].offers[k].id) > -1){
		  							likedposts.push({
		  								id : results[i].offers[k].id,
		  								name : results[i].offers[k].firstname + ' ' +  results[i].offers[k].lastname,
		  								title : results[i].offers[k].title
		  							})
		  						}
		  					};
		  				};

		  				var data = user;
						    data.liked = likedposts;
						    res.send(data).status(200).end();
					});
		  		}else{
					res.send(user).status(200).end();
		  		}
		  	}else{
		  		res.send(user).status(200).end();
		  	}
		  }
		});
	}else{
		res.status(200).end();
	}
}


function getAllUsers(req, res){
	var anbieter = [];
	var nutzer = [];

	Provider.find({},function(err,all1){
		for (var i = 0; i < all1.length; i++) {
			var add = {}

			if(all1[i].avatar){
				add.avatar = all1[i].avatar.small.replace('public/','')
			}else{
				add.avatar = 'img/avatar/avatar.png'
			}

			add.email = all1[i].email
			add.firstname = all1[i].firstname
			add.lastname = all1[i].lastname
			add.id = all1[i].id
			add.role = all1[i].role
			add.cat = "Anbieter"
			anbieter.push(add)
		};


		User.find({},function(err,all2){

			for (var i = 0; i < all2.length; i++) {
				var add_ = {}

				if(all2[i].avatar){
					add_.avatar = all2[i].avatar.small.replace('public/','')
				}else{
					add_.avatar = 'img/avatar/avatar.png'
				}
				add_.email = all2[i].email
				add_.firstname = all2[i].firstname
				add_.lastname = all2[i].lastname
				add_.id = all2[i].id
				add_.role = all2[i].role
				add_.cat = "Nutzer"
				nutzer.push(add_)
			};

			var data = {
				anbieter : anbieter,
				nutzer : nutzer,
				role : req.user.role
			}

			res.send(data).status(200).end();
		})

	})

}


function compare(a,b) {
  if (a.last_nom < b.last_nom)
    return -1;
  if (a.last_nom > b.last_nom)
    return 1;
  return 0;
}


function uploadPostImage(req,res){
	var form = new formidable.IncomingForm();
	form.on('end', function() {
		var name = this.openedFiles[0].name.replace(/^\s+|\s+$|\s+(?=\s)/g, "_");
		var newFilename = __dirname + '/../../public/uploads/posts/' + name,
			temp_path = this.openedFiles[0].path;
		fs.move(temp_path, newFilename, function(err) {
			err ? console.error(err) : res.send('/uploads/posts/' + name).status(200).end();
		});
	});
	form.parse(req, function(err, fields, files) {
		err ? console.log(err) : "";
	});
}

function addCommentPost(req, res){
	var role = capitalizeFirstLetter(req.user.role);

	eval(role).findOne({email: req.user.email}, function (err, user) {
		var message = {
			id : uuid.v4(),
			user : user,
			date : new Date(),
			opinion : req.body.opinion,
			text : req.body.text
		}

		Post.update({id: req.body.id},{$push: {messages:message}},{upsert:true},function(err){
			if(err){
		    	console.log(err);
			}else{
		    	res.send(message).status(200).end();
			}
		});
	});


}



var avatar = function(req, res, next){
	var _uuid = uuid.v4();
	var data = req.body.data
	data = data.replace(/^data:image\/\w+;base64,/, "");

	var bitmap = new Buffer(data, 'base64');
	folderNameByEmail = emailToFolder(req.user.email)
	var filename = _uuid + '.jpg';
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
		    res.status(500).end();
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
			            res.status(500).end();
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


function allOffers(req, res, next){
	Provider.find({},function(err, offers){
		var offersAll = [];

		for (var i = 0; i < offers.length; i++) {
			for (var k = 0; k < offers[i].offers.length; k++) {
				offersAll.push(offers[i].offers[k])
			}
		}

		res.send(offersAll).status(200).end();

	});
}

function emailToFolder(email){
	return email.replace(/\./g, '').replace(/\@/g, '') + '/';
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
	getAllUsers : getAllUsers,
	getAvatarInfos : getAvatarInfos,
	profile : profile,
	updatePassword : updatePassword,
	allOffers : allOffers,
	avatar : avatar,
	uploadPostImage : uploadPostImage,
	addCommentPost : addCommentPost,
	postSuggestion : postSuggestion
};