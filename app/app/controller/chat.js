var Chat = require('../models/chat')


var chats = function (req,res){
	//var user = req.user.email;
	Chat.find({},function(err,mails){
		console.log(mails)
		res.send(200).end();
	});
}

module.exports = {
	chats : chats
}