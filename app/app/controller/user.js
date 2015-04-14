var uuid = require('uuid'),
User = require('../models/user')

function register (req, res, next){
	console.log(req.body)
}

module.exports = {
	register : register
}