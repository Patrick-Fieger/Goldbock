var uuid = require('uuid'),
    formidable = require('formidable'),
    fs = require('fs-extra'),
    newLocation = 'public/uploads/',
    options = require('../../config/uploads.js'),
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
		res.send(calculatePercentage(user)).status(200).end();
	}else{
		res.status(404).end();
	}
}

function calculatePercentage(user){
	var percentage;

	if(progress_[user].type == 'images'){
		percentage = toPercentage(progress_[user].bytesReceived,progress_[user].bytesExpected);
	} else if(progress_[user].type == 'video'){
		percentage = toPercentage(progress_[user].bytesReceived,progress_[user].bytesExpected) + 33.3;
	}

	return percentage
}

function toPercentage(p1,p2){
	return p1 / p2 * 100 / 3;
}

function emailToFolder(email){
	return email.replace(/\./g, '').replace(/\@/g, '') + '/';
}


module.exports = {
	uploadOfferImages : uploadOfferImages,
	uploadOfferVideo : uploadOfferVideo,
	progress : progress
}