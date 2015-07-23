var uuid = require('uuid'),
    formidable = require('formidable'),
    dateFormat = require('dateformat'),
    fs = require('fs-extra'),
    newLocation = 'public/uploads/',
    options = require('../../config/uploads'),
    Provider = require('../models/provider'),
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

function deleteOffer(req, res, next){
	var id = req.query.id;
	Provider.findOne({ email: checkAdmin(req) }, function(err, user) {
      if (err) { console.log(err) }
      if (!user) {
        res.status(404).end();
      }else {
      	for(var i = 0; i < user.offers.length; i++) {
		    var obj = user.offers[i];
		    if( id == obj.id) {
				deleteOfferFiles(obj);
		        user.offers.splice(i, 1);
		    }
		}
		user.save(function(err) {
            if(err) {
                console.log("Error");
            }
            else {
        		res.send(id).status(200).end();
            }
        });
      }
    });
}


function deleteOfferData(req, res, next){
	var data = req.query;
	data.email = checkAdmin(req);
	deleteOfferFiles(data);
	deleteOfferFilesFromDatabase(res,data)
}


function updateOfferData(req, res, next){
	var data = req.body;
	Provider.findOne({ email: checkAdmin(req) }, function(err, user) {
      if (err) { console.log(err) }
      if (!user) {
        res.status(404).end();
      }else {
      	var alloffer = user.offers;


      	for (var i = 0; i < alloffer.length; i++) {
      		if(alloffer[i].id == data.id){

      			if(data.title !== ""){
      				alloffer[i].title = data.title
      			}

      			if(data.category !== ""){
      				alloffer[i].category = data.category
      			}

      			if(data.description !== ""){
      				alloffer[i].description = data.description
      			}

      			if(data.price !== ""){
      				alloffer[i].price = data.price
      			}

      			if(data.video !== ""){
      				alloffer[i].video = data.video
      			}

      			if(data.titleimage !== ""){
      				alloffer[i].titleimage = data.titleimage
      			}

      			if(data.per !== ""){
      				alloffer[i].per = data.per
      			}

      			if(data.reqirements !== ""){
      				alloffer[i].reqirements = data.reqirements
      			}

      			if(data.photos.length !== 0){
      				for (var k = 0; k < data.photos.length; k++) {
      					alloffer[i].photos.push(data.photos[k]);
      				};
      			}
      		}
      	}
      	

		Provider.update({email: checkAdmin(req)}, {$set: { offers: alloffer }}, {upsert: true}, function(err){if(!err){res.status(200).end()}})
      }
    });
}

// Provider.find({ email:null }).remove().exec();

function deleteOfferFilesFromDatabase (res,data){
	Provider.findOne({ email: data.email }, function(err, user) {
      if (err) { console.log(err) }
      if (!user) {
        res.status(404).end();
      }else {
      	var alloffer = user.offers
      	for (var i = 0; i < alloffer.length; i++) {
      		if(alloffer[i].id == data.id){
      			if(data.photos.length !== 0){
					for (var k = 0; k < data.photos.length; k++) {
						for (var j = 0; j < alloffer[i].photos.length; j++) {
							if(data.photos[k] == alloffer[i].photos[j]){
								alloffer[i].photos.splice(j, 1);
							}
						};
					};
				}
				var titimages = JSON.parse(data.titleimage)

				if(titimages.length !== 0 && titimages !== undefined && titimages.normal !== "" && titimages.black !== ""){
      				alloffer[i].titleimage = {};
      			}
      			if(data.video !== "" && data.video !== undefined){
      				alloffer[i].video = "";
      			}
      		}
      	};
		Provider.update({email: data.email}, {$set: { offers: alloffer }}, {upsert: true}, function(err){if(!err){res.status(200).end();}})
      }
    });
}


function deleteOfferFiles(links){
	var public = 'public/'

	if(links.photos.length !== 0){
		for (var i = 0; i < links.photos.length; i++) {
			if(links.photos[i] !== "" && links.photos[i] !== undefined){
				fs.remove(public + links.photos[i], function (err) {});
			}
		};
	}

	if(links.titleimage !== undefined && links.titleimage.normal !== "" && links.titleimage.black !== ""){
		var titimages;
		
		if(typeof(links.titleimage) == "string"){
			titimages = JSON.parse(links.titleimage);
		}else {
			titimages = links.titleimage
		}

		if(titimages.normal !== undefined && titimages.normal !== "" && titimages.black !== undefined && titimages.black !== ""){
			fs.remove(public + titimages.normal, function (err) {});
			fs.remove(public + titimages.black, function (err) {});
		};
	}
	
	if(links.video !== "" && links.video !== undefined){
		fs.remove(public + links.video, function (err) {});
	}
	
}

function removePublicFromLink(link){
	return link.replace('public/','')
}

function offer(req, res, next){
	var id = req.query.id;
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
            	offer : {}
            }
            if(user.email == req.user.email || req.user.role == "admin"){
            	offer.isown = true;
            }

            for(var i = 0; i < user.offers.length; i++) {
		    	var obj = user.offers[i];
		    	if( id == obj.id) {
		    		offer.offer = user.offers[i];
		    		offer.offer.date = dateFormat(offer.offer.date, format);
		    		res.send(offer).status(200).end();
		    	}
			}
        }
    });
}



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

module.exports = {
	uploadOfferTitleImage : uploadOfferTitleImage,
	uploadOfferImages : uploadOfferImages,
	uploadOfferVideo : uploadOfferVideo,
	uploadOfferData : uploadOfferData,
	clearProgress : clearProgress,
	offers : offers,
	offer : offer,
	deleteOffer : deleteOffer,
	deleteOfferData : deleteOfferData,
	updateOfferData : updateOfferData,
	progress : progress,
	update : update
}