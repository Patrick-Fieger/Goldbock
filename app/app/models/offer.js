var mongoose = require('mongoose')
	, idgenerator = require('../../config/id')
  	, uuid = require('uuid')


var OfferSchema = mongoose.Schema({
  id : { type: String, required: true, unique : true},
  creatorId : {type : String},
  date : {type : Date},
  business_hours : {type : Boolean},
  per : {type : String},
  title : {type : String},
  price : {type : Number},
  hours : {type : Number},
  category : {type : String},
  description : {type : String},
  order_form : { type: Array, default : []},
  sections : { type: Array, default : []},
  times : { type: Array, default : []},
  likes : {type : Number, default : 0},
  favs : {type : Number, default : 0},
  views : {type : Number, default : 0},
  purchased : {type : Number, default : 0},
  comments : { type: Array, default : []},
  activated : {type : Boolean, default : false}
});

OfferSchema.pre('create', idgenerator.generateId);
var Offer = mongoose.model('Offer', OfferSchema);
module.exports = Offer;