var mongoose = require('mongoose')
var uuid = require('uuid')


var PostSchema = mongoose.Schema({
  id : { type: String, required: true, unique : true},
  text : { type : String},
  link : { type : String},
  name : { type : String},
  profile_id : { type : String},
  date : { type : Date},
  role : { type : String},
  avatar : { type : Object},
  email : { type : String}
});
var Post = mongoose.model('Post', PostSchema);
module.exports = Post;

// setTimeout(function(){
// 	Post.create({
//   id : uuid.v4(),
//   date : new Date(),
//   text : "Das ist ein Test mit einem youtube link",
//   link : "https://www.youtube.com/watch?v=sTSA_sWGM44",
//   name : "Patrick Fieger",
//   profile_id : "38e9f9db-2636-49c9-881d-0752d5d9d72a",
//   role : "user",
//   avatar : {
//   	big: "img/avatar/avatar.png",
// 	small: "img/avatar/avatar.png"
//   },
//   email : "p@jpy.io"
// },function(err,data){
// 	console.log(err)
// 	console.log(data)
// });
// },3000)

