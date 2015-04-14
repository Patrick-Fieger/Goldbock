var mongoose = require('mongoose')
var salt = require('../../config/salt')

// User Schema
var UserSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true},
  company : { type: String},
  lastname : { type: String},
  firstname : { type: String},
  street : { type: String},
  city : { type: String},
  zip : { type: Number},
  tel : { type: String},
  avatar : { type: Object},
  booked : { type: Array},
  liked : { type: Array}
});

UserSchema.pre('save', salt.salt);
var User = mongoose.model('Users', UserSchema);
module.exports = User;