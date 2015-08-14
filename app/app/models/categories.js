var mongoose = require('mongoose')
    ,uuid = require('uuid')


// User Schema
var CategoriesSchema = mongoose.Schema({
  id: { type: String, required: true, unique: true },
  category: { type: String, required: true, unique: true },
  href: { type: String},
  subcategory: { type: Array, required: true}
});

var Categories = mongoose.model('Categories', CategoriesSchema);
module.exports = Categories;

// var data = {
//   "Gemeinsames / Verabreden" : ["Kochen / Backen","Diskutieren","Aktivitäten","Außerhaus Meeting"],
//   "Schönes und Leckeres" : ["Aus der Region"],
//   "Service" : ["Bügeln","Lesen","Geschenke","Energie & Versicherung"],
//   "Fortschritt Privat und Beruf" : ["Coaches","Berater","Therapeuten","Trainer","Spezial"],
//   "Kunst und Kultur" : ["Unterhaltung","Künstler","Theater"]
// }
        
// for (var key in data) {
//    if (data.hasOwnProperty(key)) {
//        var obj = data[key];
//        var data_ = {
//         id : uuid.v4(),
//         category : key,
//         subcategory : []
//        }
//        for (var prop in obj) {
//           data_.subcategory.push(obj[prop])
//        }

//        Categories.create(data_,function(){
//         console.log("erzeugt!")
//        });

//     }
// }
// 
// 


//Als zweites ausführen ;)

// Categories.find({},function(err,test){

// 	for (var i = 0; i < test.length; i++) {
// 		var string = test[i].category.replace(/\//,'').replace(/\s/g,'-').replace('ö','oe').replace('--','-').replace('-und-','-').toLowerCase();
// 		test[i].href = string;

// 		test[i].save(function(){
// 			console.log('saved!')
// 		})
// 	};
// })
// 
// 
