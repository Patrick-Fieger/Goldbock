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


// Seed a Superadmin
// var User = mongoose.model('superadmins', userSchema);
// var user = new User({email: 'admin@goldbock.de', password: '123'});
// user.save(function(err) {
//   if(err) {
//     console.log(err);
//   } else {
//     console.log('user: ' + user.email + " saved.");
//   }
// });