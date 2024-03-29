var mongoose = require('mongoose')
var salt = require('../../config/salt')
var geo = require('../../config/geo')
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
  offers : { type: Array},
  liked : { type: Array},
  geo : { type: Object},
  deactivated : false
});

ProviderSchema.pre('save', geo.setGeo, salt.salt);
ProviderSchema.pre('create', salt.salt , geo.setGeo ,idgenerator.generateId);
var Provider = mongoose.model('Providers', ProviderSchema);
module.exports = Provider;


// CLEAR OFFER DATA!!!
// Provider.find({},function(err,provs){
//   for (var i = 0; i < provs.length; i++) {
//     provs[i].offers = undefined;
//     provs[i].save();
//   }
// });