var Chats = require('../models/chat'),
    uuid = require('uuid');

module.exports = function(io) {
    var chats = [];
    io.sockets.on('connection', function(socket) {
        

        socket.on('join',function(data){
            socket.join(data.email);
        });

        socket.on('sign to new chat',function(data){
            socket.join(data.id);
        });

        socket.on('get chats', function(data, callback) {
            Chats.find({}, function(err, chats_) {
                var data_ = [];
                for (var i = 0; i < chats_.length; i++) {
                    if ((chats_[i].from == data.email || chats_[i].to == data.email) && chats_[i].isArchieved.indexOf(data.email) !== 0) {
                        socket.join(chats_[i].id);
                        data_.push(chats_[i])
                    }
                };
                callback(data_);
            });
        });

        socket.on('typing', function(data) {
            io.to(data.id).emit('typing', data)
        });

        socket.on('open new chat', function(data, callback) {
            var newchat = data;
            newchat.id = uuid.v4();
            Chats.create(newchat, function(err) {
                if (!err) {
                    socket.join(newchat.id);
                    io.to(newchat.to).emit('new chat opened',newchat)
                    callback(newchat)
                } else {
                    console.log(err)
                }
            });
        });


        socket.on('get unreaded messages', function(data, callback) {
            Chats.find({}, function(err, chats_) {
                var ids = [];
                for (var i = 0; i < chats_.length; i++) {
                    if ((chats_[i].from == data.email || chats_[i].to == data.email) && chats_[i].isArchieved.indexOf(data.email) !== 0) {
                        socket.join(chats_[i].id);
                        if ((chats_[i].from == data.email && chats_[i].unreaded.indexOf(data.email) > -1) || (chats_[i].to == data.email && chats_[i].unreaded.indexOf(data.email) > -1)) {
                            if (ids.indexOf(chats_[i].id) == -1) {
                                ids.push(chats_[i].id)
                            }
                        }
                    }
                }
                callback(ids);
            })
        });


        socket.on('delete chat', function(data, callback) {
            Chats.findOne({
                id: data.id
            }, function(err, chat) {
                if (!err) {
                    chat.isArchieved.push(data.email)
                    chat.save(function(err) {
                        if (!err) {
                            callback({
                                isDeleted: true,
                                id: data.id
                            });
                        }
                    });
                }
            })
        });


        socket.on('message readed', function(data) {
            Chats.findOne({
                id: data.id
            }, function(err, chat) {
                if (chat.unreaded.length > 0 && chat.unreaded.indexOf(data.from) > -1) {
                    chat.unreaded.splice(chat.unreaded.indexOf(data.from), 1);
                }
                chat.save(function(err) {
                    if (err) {
                        console.log(err)
                    }
                });
            });
        });

        function selfMessage(from,from_){
            return from == from_
        }

        socket.on('new message', function(data) {
            var message = {
                    from: data.from,
                    text: data.message,
                    date: Date.now()
                }
            Chats.findOne({
                id: data.id
            }, function(err, chat) {
                chat.messages.push(message);
                if (message.from == chat.from && chat.unreaded.indexOf(chat.to) == -1) {
                    chat.unreaded.push(chat.to);
                } else if (chat.unreaded.indexOf(chat.from) == -1) {
                    chat.unreaded.push(chat.from);
                }

                if(chat.isArchieved.length > 0){
                    if(selfMessage(data.from,chat.from) && chat.unreaded.indexOf(chat.to) > -1){
                        io.to(chat.to).emit('open old chat',chat);
                    }else if(selfMessage(data.from,chat.to) && chat.unreaded.indexOf(chat.from) > -1){
                        io.to(chat.from).emit('open old chat',chat);
                    }
                    chat.isArchieved = [];
                }

                

                chat.save(function(err) {
                    if (!err) {
                        io.to(data.id).emit('new message', {
                            message: message,
                            id: data.id
                        })
                    } else {
                        console.log(err)
                    }
                })
            });
        });
    });
};