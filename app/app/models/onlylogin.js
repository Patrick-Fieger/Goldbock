var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var salt = require('../../config/salt')
var idgenerator = require('../../config/id')

// User Schema
var LoginSchema = mongoose.Schema({
  id__: { type: String,required: true, unique: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  role: { type: String, required: true},
  emailVerificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  deactivated : false
});

LoginSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

LoginSchema.pre('save', salt.salt);
LoginSchema.pre('create', salt.salt, idgenerator.generateId);
var Login = mongoose.model('Login', LoginSchema);
module.exports = Login;

// Login.find({ email:"patrick.fieger@me.com" }).remove().exec();


// var Provider = require('../models/provider'),
//   User = require('../models/user'),
//   async = require('async');

// Login.find({},function(err,user){
//   async.each(user, function (user_, callback) {
//     var u = user_;

//     if(u.role !== "admin"){
//       eval(capitalizeFirstLetter(u.role)).findOne({email:u.email},function(err,finders){
//         u.id__ = finders.id;
//         u.save();
//       });
//     }
//   });
// });


// function capitalizeFirstLetter(string) {
//     return string.charAt(0).toUpperCase() + string.slice(1);
// }