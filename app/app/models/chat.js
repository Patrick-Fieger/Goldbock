var mongoose = require('mongoose')
  , idgenerator = require('../../config/id')
  , uuid = require('uuid')


var ChatSchema = mongoose.Schema({
  id : { type: String, required: true, unique : true},
  from: { type: Object, required: true},
  to: { type: Object, required: true},
  created: { type: Date, default: Date.now() , required: true},
  unreadFrom : { type: Boolean},
  unreadTo : { type: Boolean},
  isArchievedFrom : { type: Boolean},
  isArchievedTo : { type: Boolean},
  messages : {type : Array}
});

ChatSchema.pre('create', idgenerator.generateId);
var Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;


// var test = {
//   id : uuid.v4(),
//   from : "patrickfieger90@gmail.com",
//   to : "oliver.bock@goldbock.com",
//   messages : [
//     {
//       from : "patrickfieger90@gmail.com",
//       text : "This is a text",
//       date : Date.now()
//     },
//     {
//       from : "oliver.bock@goldbock.com",
//       text : "This is a text",
//       date : Date.now() + -5*24*3600*1000
//     }
//   ]
// }


// Chat.create(test,function(err,done){
//   if(err){
//     console.log(err)
//   }else{
//     console.log('created!!!!');
//   }
// })