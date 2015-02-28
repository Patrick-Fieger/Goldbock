var mongoose = require('mongoose')
, bcrypt = require('bcrypt')
, SALT_WORK_FACTOR = 10;

// User Schema
var superUserSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
});

// Bcrypt middleware
superUserSchema.pre('save', function(next) {
    var user = this;
    if(!user.isModified('password')) return next();
    bcrypt.hash(user.password, SALT_WORK_FACTOR, function(err, hash) {
        if(err) return next(err);
        user.password = hash;
        next();
    });
});

var SuperUser = mongoose.model('superadmins', superUserSchema);

module.exports = SuperUser;

// Seed a Superadmin
// var superuser_ = new SuperUser({email: 'admin@goldbock.de', password: '123'});
// superuser_.save(function(err) {
//   if(err) {
//     console.log(err);
//   } else {
//     console.log('user: ' + superuser_.email + " saved.");
//   }
// });