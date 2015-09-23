var Chats = require('../models/chat')

module.exports = function(io){
  var chats = [];

  io.sockets.on('connection', function (socket) {
    

  	socket.on('get chats',function(data,callback){
  		Chats.find({},function(err,chats_){
  			var data_ = [];

  			for (var i = 0; i < chats_.length; i++) {
  				if(chats_[i].from == data.email || chats_[i].to == data.email){
            socket.join(chats_[i].id);
            data_.push(chats_[i])
  				}
  			};
  			callback(data_)
    	});
  	});


    socket.on('new message',function(data){
      var message = {
        from : data.from,
        text : data.message,
        date : Date.now()
      }

      Chats.update({id : data.id},{$push: {messages: message}},function(err,done){
        io.to(data.id).emit('new message',{message : message, id : data.id})
      });

    });

  });
}