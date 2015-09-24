var Chat = require('../models/chat')


var unreadedmessages = function (req,res){
	var user = req.user.email;
	var count = 0;

	Chat.find({},function(err,chats){
		
		for (var i = 0; i < chats.length; i++) {
			if((chats[i].from == user && chats[i].isArchieved.indexOf(user) > -1) || (chats[i].to == user && chats[i].isArchieved.indexOf(user) > -1)){
				count++;
			}	
		};

		res.send(count).status(200).end();
	});
}

module.exports = {
	unreadedmessages : unreadedmessages
}