var mongoose = require('mongoose')
var salt = require('../../config/salt')

// User Schema
var ProviderSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  role: { type: String, required: true}
});

ProviderSchema.pre('save', salt.salt);
var Provider = mongoose.model('Providers', ProviderSchema);
module.exports = Provider;