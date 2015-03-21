var uuid = require('uuid'),
    formidable = require('formidable'),
    fs = require('fs-extra'),
    newLocation = 'public/uploads/',
    options = require('../../config/uploads.js'),
    observableDiff = require('deep-diff').observableDiff,
    Provider = require('../models/provider')
    progress_ = {};

function uploadOfferImages(req, res, next){
	var form = new formidable.IncomingForm(options.images)
	, imageList = []
    , folderNameByEmail = emailToFolder(req.user.email);
    
    form.on('end', function() {
		setTimeout(function(){
			res.send(imageList).status(200).end();
		},500)
	});

    form.on('file', function(name, file) {
		var newFilename = uuid.v4() + '.' + file.name.split('.').pop()
		, temp_path = file.path

		fs.move(temp_path, newLocation + folderNameByEmail + newFilename, function(err) {
            if (err) {
                console.error(err);
            } else {
                imageList.push(newFilename)
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
	folderNameByEmail = emailToFolder(req.user.email)

    form.on('end', function() {
		var newFilename = uuid.v4() + '.' + this.openedFiles[0].name.split('.').pop()
		, temp_path = this.openedFiles[0].path

		fs.move(temp_path, newLocation + folderNameByEmail + newFilename, function(err) {
            if (err) {
                console.error(err);
            } else {
                res.send(newFilename).status(200).end();
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

function progress(req, res, next){
	var user = emailToFolder(req.user.email)
	if(progress_[user] !== undefined){
		var pro_ = calculatePercentage(user);
		res.send(pro_).status(200).end();
	}else{
		res.status(404).end();
	}
}

function calculatePercentage(user){
	var percentage = {
		progress : 0,
		message : ""
	};

	if(progress_[user].type == 'images'){
		percentage.progress = toPercentage(progress_[user].bytesReceived,progress_[user].bytesExpected);
		percentage.message = "Lade Bilder hoch";
	} else if(progress_[user].type == 'video'){
		percentage.progress = toPercentage(progress_[user].bytesReceived,progress_[user].bytesExpected) + 33.3;
		percentage.message = "Lade Video hoch";
	}

	return percentage
}

function toPercentage(p1,p2){
	return p1 / p2 * 100 / 3;
}

function emailToFolder(email){
	return email.replace(/\./g, '').replace(/\@/g, '') + '/';
}


function update(req, res, next){
	Provider.findOne({ email: req.user.email }, function(err, user) {
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



module.exports = {
	uploadOfferImages : uploadOfferImages,
	uploadOfferVideo : uploadOfferVideo,
	progress : progress,
	update : update
}