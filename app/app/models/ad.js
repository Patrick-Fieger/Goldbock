var mongoose = require('mongoose')
  , uuid = require('uuid')


var AdSchema = mongoose.Schema({
  id : { type: String, required: true, unique : true},
  ads : { type : Array}
});

var Ad = mongoose.model('Ad', AdSchema);
module.exports = Ad;

Ad.find({},function(err,ads){
	if(ads.length == 0){
		var data = {
			id : uuid.v4(),
			ads : []
		}
		Ad.create(data);
		console.log('Ads initialized!');
	}
})