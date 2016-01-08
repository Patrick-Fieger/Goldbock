var uuid = require('uuid');

var generateId = function(next){
	console.log(this)
	this.id = uuid.v4();
	return next();
}

module.exports = {
	generateId : generateId
}