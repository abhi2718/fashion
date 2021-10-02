var mongoose=require("mongoose");
var womenFashion =new mongoose.Schema({
	img:String,
	name:String
	
	});
var Womenfashion=mongoose.model("Womenfashion",womenFashion );
module.exports=Womenfashion;