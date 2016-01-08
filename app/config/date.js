var moment = require('moment');

var generateDate = function(next){
	this.date = moment().format('L');
	return next();
}

module.exports = {
	generateDate : generateDate
}