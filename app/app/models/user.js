var mongoose = require('mongoose')
var salt = require('../../config/salt')
var idgenerator = require('../../config/id')
var uuid = require('uuid');

var UserSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true},
  password: { type: String, required: true, select: false},
  id: { type: String, required: true, unique: true},
  company : { type: String},
  lastname : { type: String},
  firstname : { type: String},
  street : { type: String},
  city : { type: String},
  zip : { type: Number},
  tel : { type: String},
  avatar : { type: Object},
  booked : { type: Array},
  liked : { type: Array},
  deactivated : false
});

UserSchema.pre('save', salt.salt);
UserSchema.pre('create', salt.salt, idgenerator.generateId);
var User = mongoose.model('Users', UserSchema);
module.exports = User;

// User.find({ email:"patrick.fieger@me.com" }).remove().exec();
//
// User.find({},function(err,user){
//   for (var i = 0; i < user.length; i++) {
//     user[i].id = uuid.v4();
//     user[i].save()
//   };
// })