var request = require('request');


function setGeo (next){
	var user = this;
	request('http://maps.google.com/maps/api/geocode/json?address='+user.zip+'+'+user.street, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	var body_ = JSON.parse(body)
	  	if(body_.results[0]){
	  		user.geo = body_.results[0].geometry.location
	  	}
	   	return next();
	  }else{
	  	return next(error);
	  }
	})
}

module.exports = {
	setGeo: setGeo
}
