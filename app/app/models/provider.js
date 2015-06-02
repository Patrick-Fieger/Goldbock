var mongoose = require('mongoose')
var salt = require('../../config/salt')
var idgenerator = require('../../config/id')

// User Schema
var ProviderSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true},
  id: { type: String, required: true, unique: true},
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
ProviderSchema.pre('create', salt.salt , idgenerator.generateId);
var Provider = mongoose.model('Providers', ProviderSchema);
module.exports = Provider;