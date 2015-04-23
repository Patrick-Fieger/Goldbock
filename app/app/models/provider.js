var mongoose = require('mongoose')
var salt = require('../../config/salt')

// User Schema
var ProviderSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true},
  company : { type: String, required: true},
  lastname : { type: String, required: true},
  firstname : { type: String, required: true},
  street : { type: String, required: true},
  city : { type: String, required: true},
  zip : { type: Number, required: true},
  tel : { type: String, required: true},
  about : { type: String},
  avatar : { type: Object},
  offers : { type: Array}
});

ProviderSchema.pre('save', salt.salt);
var Provider = mongoose.model('Providers', ProviderSchema);
module.exports = Provider;