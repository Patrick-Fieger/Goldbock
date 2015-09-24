var mongoose = require('mongoose')
  , idgenerator = require('../../config/id')
  , uuid = require('uuid')


var ChatSchema = mongoose.Schema({
  id : { type: String, required: true, unique : true},
  from: { type: Object, required: true},
  to: { type: Object, required: true},
  created: { type: Date, default: Date.now() , required: true},
  unreaded : { type: Array, default : []},
  isArchieved : { type: Array},
  messages : {type : Array}
});

ChatSchema.pre('create', idgenerator.generateId);
var Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;