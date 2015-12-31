var uuid = require('uuid');

var generateId = function(next){
	this.id = uuid.v4();
	next();
}



module.exports = {
	generateId : generateId
}