var mongoose=require("mongoose");
var menFashion =new mongoose.Schema({
	img:String,
	name:String
	
	});
var Menfashion=mongoose.model("Menfashion",menFashion);
module.exports=Menfashion;