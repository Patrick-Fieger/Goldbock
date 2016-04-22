var Offer = require('../models/offer'),
Provider = require('../models/provider'),
User = require('../models/user'),
uuid = require('uuid'),
formidable = require('formidable'),
newLocation = 'public/uploads/',
options = require('../../config/uploads'),
email = require('../emailtemplates/sender')
progress_ = {};


function uploadOfferImages(req,res){
	var form = new formidable.IncomingForm(options.images)
	, imageList = []
    , folderNameByEmail = emailToFolder(checkAdmin(req))
    , index;

    form.on('end', function() {
		setTimeout(function(){
			res.send({
				images : imageList,
				index : index
			}).status(200).end();
		},500)
	});


    form.on('file', function(name, file) {
		var newFilename = newLocation + folderNameByEmail + uuid.v4() + '.' + file.name.split('.').pop()
		, temp_path = file.path
		, name = file.name

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
        index = fields.index
    });
}

function uploadOfferVideo(req, res, next){
	var form = new formidable.IncomingForm(options.video),
	folderNameByEmail = emailToFolder(checkAdmin(req)),
	index;

    form.on('end', function() {
		var newFilename = newLocation + folderNameByEmail + uuid.v4() + '.' + this.openedFiles[0].name.split('.').pop()
		, temp_path = this.openedFiles[0].path
		, name = this.openedFiles[0].name

		fs.move(temp_path,newFilename, function(err) {
            if (err) {
                console.error(err);
            } else {
                res.send({
                	new : removePublicFromLink(newFilename),
                	old : name,
                	index : index
                }).status(200).end();
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
        index = fields.index
    });
}


function uploadOfferData(req, res, next){

	if(!req.body.isEdited){
		var offer = req.body;
	    offer.id = uuid.v4(),
	    eval(capitalizeFirstLetter(req.user.role)).findOne({ email: req.user.email }, function(err, user_) {
			offer.creatorId = user_.id;
			Offer.create(offer,function(err){
        		if(err){
        	    	console.log(err);
        		}else{
        	    	res.status(200).end();
        	    	sendMail(offer.id);
        		}
			});
		});
	}else{
		var offer = req.body.data;
		Offer.findOne({id: offer.id},function(err,o){
			checkDeletions(offer,o);
			Offer.update({id: offer.id}, offer, {upsert:true}, function(err){
				if(!err){
					res.status(200).end();
					sendMail(offer.id);
				}else{
					console.log(err);
				}
			});
		});
	}
}

function checkDeletions(new_,old){
	var oldSections = old.sections;
	var newSections = new_.sections;

	var files = [];

	if(newSections.length !== 0){
		for (var i = 0; i < newSections.length; i++) {
			var n = newSections[i];

			if(n.type == "fotos"){
				for (var k = 0; k < n.fotos.length; k++) {
					files.push(n.fotos[k])
				}
			}else if(n.type == "video"){
				files.push(n.video)
			}
		}
	}

	if(oldSections.length !== 0){
		for (var x = 0; x < oldSections.length; x++) {
			var o = oldSections[x];

			if(o.type == "fotos"){
				for (var y = 0; y < o.fotos.length; y++) {
					if(files.indexOf(o.fotos[y]) == -1){
						deleteOfferFile(o.fotos[y]);
					}
				}
			}else if(o.type == "video"){
				if(files.indexOf(o.video) == -1){
					deleteOfferFile(o.video);
				}
			}
		}
	}
}

function sendMail (id){
	// Ändern Wenn LIVE!!!  "oliver.bock@goldbock.com",
	var emails = ["patrick.fieger@steinbock.info"];
	var host = "http://localhost:3000";

	for (var i = 0; i < emails.length; i++) {
		email.sendEmail({
    		email: emails[i],
    		link : host + '/#/offer/' + id
    	},'check_offer');
	}
}

function getoffersuser(req,res){
	var id = req.user.id__;
	Offer.find({creatorId : id},function(err,offers){
		if(!err) res.send(offers).status(200).end();
	});
}

function getoffer(req,res) {
	var id = req.query.id;
	Offer.findOne({id:id},function(err,offer){
		var offer_ = offer;
		Login.findOne({id__ : offer_.creatorId},function(err,id_user){
			eval(capitalizeFirstLetter(id_user.role)).findOne({id : id_user.id__},function(err,user){
				var data = {
					offer: offer_,
					creator : user,
					isown : offer_.creatorId == req.user.id__
				};

				res.send(data).status(200).end();
			});
		});
	});
}

function changeOfferState(req,res){
	var b = req.body;

	Offer.findOne({id : b.id},function(err,offer){
		offer.activated = b.state;

		offer.save(function(err){
			if(!err){
				var message = "Deaktivierung erfolgreich";
				if(b.state){
					message = "Aktivierung erfolgreich";
				}

				res.send(message).status(200).end();
			}

		});
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


function addComment(req,res){
	var d = req.body;
	eval(capitalizeFirstLetter(req.user.role)).findOne({ email: req.user.email }, function(err, user) {
		d.data.name = user.firstname + " " + user.lastname;

		Offer.update({id: d.id}, {$push: {comments: d.data}}, {upsert:true}, function(err){
        	if(!err) res.send(d.data).status(200).end();
		});
	});
}


// delete Offer
function deleteOffer(req, res, next){
	var id = req.query.id;
	Offer.findOne({ id : id }, function(err, offer) {
      if (err) console.log(err)
      	deleteOfferFiles(offer);
      	offer.remove();
      	res.send(id).status(200).end();
    });
}

function deleteOfferFiles(offer){
	if(offer.sections){
		for (var i = 0; i < offer.sections.length; i++) {
			var type = offer.sections[i].type
			if(type == "fotos"){
				for (var k = 0; k < offer.sections[i].fotos.length; k++) {
					deleteOfferFile(offer.sections[i].fotos[k])
				}
			}else if(type == "video"){
				deleteOfferFile(offer.sections[i].video)
			}
		}
	}
}


function deleteOfferFile(file){
	var base = __dirname.split('app/controller')[0];
	var link =  base + 'public/' + file;
	fs.unlink(link)
}



function toPercentage(p1,p2){
	return p1 / p2 * 100 / 4;
}


function checkAdmin(req){
	if(req.user.role == "admin"){
		return req.cookies.email
	}else{
		return req.user.email
	}
}

function emailToFolder(email){
	return email.replace(/\./g, '').replace(/\@/g, '') + '/';
}

function removePublicFromLink(link){
	return link.replace('public/','')
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}




module.exports = {
	addComment : addComment,
	changeOfferState : changeOfferState,
	getoffersuser : getoffersuser,
	getoffer : getoffer,
	uploadOfferImages : uploadOfferImages,
	uploadOfferVideo : uploadOfferVideo,
	uploadOfferData : uploadOfferData,
	progress : progress,
	deleteOffer : deleteOffer
}