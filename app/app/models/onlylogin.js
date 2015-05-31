var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var salt = require('../../config/salt')
var idgenerator = require('../../config/id')

// User Schema
var LoginSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  role: { type: String, required: true},
  emailVerificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
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