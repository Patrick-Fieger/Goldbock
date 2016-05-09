var uuid = require('uuid'),
    formidable = require('formidable'),
    dateFormat = require('dateformat'),
    fs = require('fs-extra'),
    newLocation = 'public/uploads/',
    options = require('../../config/uploads'),
    Provider = require('../models/provider'),
    Ad = require('../models/ad'),
    User = require('../models/user'),
    Categories = require('../models/categories'),
    gm = require('gm'),
    progress_ = {};

    var format = "dddd, d. mmmm , yyyy, HH:MM:ss";

    dateFormat.i18n = {
		dayNames: [
		  'So', 'Mon', 'Di', 'Mi', 'Do', 'Fr', 'Sa',
		  'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'
		],
		monthNames: [
		  'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez',
		  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
		]
  	};


function uploadOfferTitleImage(req, res, next){
	var form = new formidable.IncomingForm(options.video),
	folderNameByEmail = emailToFolder(checkAdmin(req))

    form.on('end', function() {
    	var _uuid = uuid.v4();
		var newFilenameImage = _uuid + '.' + this.openedFiles[0].name.split('.').pop()
		, newFilenameImageBlurred = _uuid + '_black.' + this.openedFiles[0].name.split('.').pop()
		, temp_path = this.openedFiles[0].path
		, newPathImage = newLocation + folderNameByEmail + newFilenameImage
		, newPathImageBlurred = newLocation + folderNameByEmail + newFilenameImageBlurred
		fs.move(temp_path, newPathImage , function(err) {
            if (err) {
                console.error(err);
            } else {
            	var images = {
            		normal : newPathImage,
            		black : newPathImageBlurred
            	}
            	createBlackWhiteVersion(newPathImage,newPathImageBlurred);
            	images.normal = removePublicFromLink(newPathImage);
            	images.black = removePublicFromLink(newPathImageBlurred);
                res.send(images).status(200).end();
            }
        });
	});

	form.on('progress', function(bytesReceived, bytesExpected) {
	  var progress__ = {
	    type: 'title',
	    bytesReceived: bytesReceived,
	    bytesExpected: bytesExpected
	  };
	  progress_[folderNameByEmail] = progress__
	});

	form.parse(req, function(err, fields, files) {
        if (err) console.log(err);
    });
}

function createBlackWhiteVersion (path,blurred) {
	gm(path).colorspace('GRAY')
	.write(blurred, function (err) {
		if (!err){
			console.log('TitleImage saved!')
		}
	})
}



function uploadOfferImages(req, res, next){
	var form = new formidable.IncomingForm(options.images)
	, imageList = []
    , folderNameByEmail = emailToFolder(checkAdmin(req));

    form.on('end', function() {
		setTimeout(function(){
			res.send(imageList).status(200).end();
		},500)
	});

    form.on('file', function(name, file) {
		var newFilename = newLocation + folderNameByEmail + uuid.v4() + '.' + file.name.split('.').pop()
		, temp_path = file.path

		fs.move(temp_path, newFilename, function(err) {
            if (err) {
                console.error(err);
            } else {
                imageList.push(removePublicFromLink(newFilename))
            }
        });
	});

	form.on('progress', function(bytesReceived, bytesExpected) {
	  var progress__ = {
	    type: 'images',
	    bytesReceived: bytesReceived,
	    bytesExpected: bytesExpected
	  };
	  progress_[folderNameByEmail] = progress__
	});

	form.parse(req, function(err, fields, files) {
        if (err) console.log(err);
    });
}

function uploadOfferVideo(req, res, next){
	var form = new formidable.IncomingForm(options.video),
	folderNameByEmail = emailToFolder(checkAdmin(req))

    form.on('end', function() {
		var newFilename = newLocation + folderNameByEmail + uuid.v4() + '.' + this.openedFiles[0].name.split('.').pop()
		, temp_path = this.openedFiles[0].path

		fs.move(temp_path,newFilename, function(err) {
            if (err) {
                console.error(err);
            } else {
                res.send(removePublicFromLink(newFilename)).status(200).end();
            }
        });
	});

	form.on('progress', function(bytesReceived, bytesExpected) {
	  var progress__ = {
	    type: 'video',
	    bytesReceived: bytesReceived,
	    bytesExpected: bytesExpected
	  };
	  progress_[folderNameByEmail] = progress__
	});

	form.parse(req, function(err, fields, files) {
        if (err) console.log(err);
    });
}


function uploadOfferData(req, res, next){
	var offer = req.body;
	    offer.id = uuid.v4(),
		offer.likes = 0,
		offer.views = 0,
		offer.booked = 0,
		offer.searched = 0,
		offer.date = new Date()
		offer.reviews = [];

		Provider.update({email: checkAdmin(req)},{$push: {offers:offer}},{upsert:true},function(err){
        	if(err){
        	    console.log(err);
        	}else{
        	    res.status(200).end();
        	}
		});
}

function progress(req, res, next){
	var user = emailToFolder(checkAdmin(req))
	if(progress_[user] !== undefined){
		var pro_ = calculatePercentage(user);
		res.send(pro_).status(200).end();
	}else{
		res.status(200).end();
	}
}

function calculatePercentage(user){
	var percentage = {
		progress : 0,
		message : ""
	};

	if(progress_[user].type == 'title'){
		percentage.progress = toPercentage(progress_[user].bytesReceived,progress_[user].bytesExpected);
		percentage.message = "Lade Titelbild hoch";
	} else if(progress_[user].type == 'images'){
		percentage.progress = toPercentage(progress_[user].bytesReceived,progress_[user].bytesExpected) + 25;
		percentage.message = "Lade Bilder hoch";
	} else if(progress_[user].type == 'video'){
		percentage.progress = toPercentage(progress_[user].bytesReceived,progress_[user].bytesExpected) + 50;
		percentage.message = "Lade Video hoch";
	}

	return percentage
}

function toPercentage(p1,p2){
	return p1 / p2 * 100 / 4;
}

function emailToFolder(email){
	return email.replace(/\./g, '').replace(/\@/g, '') + '/';
}


function offers(req, res, next){
	Provider.findOne({ email: checkAdmin(req) }, function(err, user) {
      if (err) { console.log(err) }
      if (!user) {
        res.status(404).end();
      }else {
      	res.send(user.offers).status(200).end();
      }
    });
}

function update(req, res, next){
	Provider.findOne({ email: checkAdmin(req) }, function(err, user) {
      if (err) { console.log(err) }
      if (!user) {
        res.status(404).end();
      }else {
      	var body = req.body
      	for (var key in body) {
		   if(body[key] !== user[key]){
		   		user[key] = body[key]
		   }
		}
		user.save(function(err) {
            if(err) {
                console.log("Error");
            }
            else {
        		res.status(200).end();
            }
        });
      }
    });
}

function removePublicFromLink(link){
	return link.replace('public/','')
}

function offer(req, res, next){
	var id = req.query.id;
	var isfavorite = false;
	User.findOne({email : req.user.email},function(err,user_){
		if(user_){
			if(user_.liked.indexOf(id) > -1){
				isfavorite = true;
			}
		}


		Provider.findOne({offers: {$elemMatch: {id : id}}}, function (err, user) {
		    if (err){
		        console.log(err)
		    }
		    if (user) {
		    	var avatar;
		    	if(user.avatar){
					avatar = user.avatar.small
		    	}

		        var offer = {
		        	avatar : avatar,
		        	name : user.firstname + ' ' + user.lastname,
		        	city : user.city,
		        	zip : user.zip,
		        	id : user.id,
		        	email : user.email,
		        	geo : user.geo,
		        	street : user.street,
		        	isown : false,
		        	isfavoriteOfUser : isfavorite,
		        	offer : {},
		        	sameCategory : []
		        }
		        if(user.email == req.user.email || req.user.role == "admin"){
		        	offer.isown = true;
		        }

		        for(var i = 0; i < user.offers.length; i++) {
			    	var obj = user.offers[i];
			    	if( id == obj.id) {
			    		offer.offer = user.offers[i];
			    		offer.offer.date = dateFormat(offer.offer.date, format);

			    		Provider.find({offers: {$elemMatch: {category : offer.offer.category}}}, function (err, offers_) {
			    			for (var i = 0; i < offers_.length; i++) {
			    				for (var k = 0; k < offers_[i].offers.length; k++) {
			    					if(offers_[i].offers[k].category == offer.offer.category && offers_[i].offers[k].id !== id){
			    						offer.sameCategory.push(offers_[i].offers[k]);
			    					}
			    				};
			    			};

			    			Categories.find({},function(err,categories){
			    				offer.categories = categories
			    				res.send(offer).status(200).end();
			    			});

			    		});


			    	}
				}
		    }
		});
	});
}


// function favorites(req, res, next){
// 	var fav = req.body;


// 	User.findOne({email : req.user.email},function(err,user){
// 		if(user.liked.indexOf(fav.id) == -1 && !fav.addOrRemove){
// 			user.liked.push(fav.id);
// 		}else if(user.liked.indexOf(fav.id) > -1 && fav.addOrRemove){
// 			user.liked.splice(user.liked.indexOf(fav.id),1);
// 		}

// 		user.save();

// 		Provider.findOne({offers: {$elemMatch: {id : fav.id}}}, function (err, offer) {
// 		    if (err){
// 		        console.log(err)
// 		    }else{
// 				var alloffer = offer.offers;

// 		        for(var i = 0; i < alloffer.length; i++) {
// 			    	if( fav.id == alloffer[i].id) {
// 			    		if(!fav.addOrRemove){
// 			    			alloffer[i].likes++;
// 			    		}else{
// 			    			alloffer[i].likes--;
// 			    		}

// 			    		Provider.update({email: offer.email}, {$set: { offers: alloffer }}, {upsert: true}, function(err){if(!err){res.status(200).end();}})

// 			    		// offer.save(function(err){
// 			    		// 	if(!err){
// 			    		// 		res.status(200).end();
// 			    		// 	}
// 			    		// });
// 			    	}
// 				}
// 		    }
// 		});
// 	});
// }


function clearProgress(req, res, next){
	var email = emailToFolder(checkAdmin(req));
	delete progress_[email];
	res.status(200).end();
}

function checkAdmin(req){
	if(req.user.role == "admin"){
		return req.cookies.email
	}else{
		return req.user.email
	}
}


function addAdvertising (req,res){
	var d = req.body.ad;
	var u = req.user.email;
	d.timestamp = new Date().getTime();
	d.addedBy = u;


	Ad.find({},function(err,advertisment){

		var timestamp = new Date().getTime() - (7 * 24 * 60 * 60 * 1000);
		var ok = false;

		var users = [];
		var addds = [];


		if(advertisment[0].ads.length !== 0){
			for (var i = 0; i < advertisment[0].ads.length; i++) {
				users.push(advertisment[0].ads[i].addedBy);
				addds.push(advertisment[0].ads[i].timestamp);
			};

			if(users.indexOf(u) > -1){
				if(advertisment[0].ads[users.indexOf(u)].timestamp < timestamp){
					ok = true;
				}
			}else{
				ok = true;
			}

			if(ok){
				advertisment[0].ads.unshift(d);
				advertisment[0].save(function(err){
					if(!err){
						res.send(200).end();
					}else{
						console.log(err);
						res.send(500).end();
					}
				});
			}else{
				res.send(500).end();
			}


		}else{
			advertisment[0].ads.unshift(d);
			advertisment[0].save(function(err){
				if(!err){
					res.send(200).end();
				}else{
					console.log(err);
					res.send(500).end();
				}
			})
		}
	});


	// Post.find({'email': curPage}).sort('-date').limit(1).exec(function(err, posts){
 //    	console.log("Emitting Update...");
 //    	socket.emit("Update", posts.length);
 //    	console.log("Update Emmited");
	// });

}



module.exports = {
	uploadOfferTitleImage : uploadOfferTitleImage,
	uploadOfferImages : uploadOfferImages,
	uploadOfferVideo : uploadOfferVideo,
	uploadOfferData : uploadOfferData,
	clearProgress : clearProgress,
	offers : offers,
	offer : offer,
	// deleteOffer : deleteOffer,
	// deleteOfferData : deleteOfferData,
	// updateOfferData : updateOfferData,
	progress : progress,
	update : update,
	// favorites : favorites,
	addAdvertising : addAdvertising
}