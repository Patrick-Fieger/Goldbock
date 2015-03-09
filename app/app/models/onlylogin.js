var mongoose = require('mongoose')
var salt = require('../../config/salt')

// User Schema
var LoginSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  role: { type: String, required: true}
});

LoginSchema.pre('save', salt.salt);
var Login = mongoose.model('Login', LoginSchema);
module.exports = Login;


// SuperuserLogin
// var data = {
//   email: 'admin@goldbock.de',
//   password: '123',
//   role:'admin'
// }