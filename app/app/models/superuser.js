var mongoose = require('mongoose')
, salt = require('../../config/salt')
, Login = require('./onlylogin')

// User Schema
var superUserSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  role: { type: String, required: true}
});

// Bcrypt middleware
superUserSchema.pre('save', salt.salt);

var SuperUser = mongoose.model('superadmins', superUserSchema);

var data = {
  email: 'admin@goldbock.de',
  password: '123',
  role:'admin'
}

// Seed a Superadmin
// var superuser_ = new SuperUser(data);
// superuser_.save(function(err) {
//   if(err) {
//     console.log(err);
//   } else {
//     console.log('user: ' + superuser_.email + " saved.");
//   }
// });


// var login_ = new Login(data);
// login_.save(function(err) {
//   if(err) {
//     console.log(err);
//   } else {
//     console.log('loginuser: ' + login_.email + " saved.");
//   }
// });


module.exports = SuperUser;