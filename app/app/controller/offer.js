var Offer = require('../models/offer'),
Provider = require('../models/provider'),
User = require('../models/user'),
uuid = require('uuid'),
formidable = require('formidable'),
newLocation = 'public/uploads/',
options = require('../../config/uploads'),
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
	var offer = req.body;
	    offer.id = uuid.v4(),

	    eval(capitalizeFirstLetter(req.user.role)).findOne({ email: req.user.email }, function(err, user_) {
			offer.creatorId = user_.id;

			console.log(offer)
			Offer.create(offer,function(err){
        		if(err){
        	    	console.log(err);
        		}else{
        	    	res.status(200).end();
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
	uploadOfferImages : uploadOfferImages,
	uploadOfferVideo : uploadOfferVideo,
	uploadOfferData : uploadOfferData,
	progress : progress
}