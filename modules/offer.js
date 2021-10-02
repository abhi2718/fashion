var mongoose=require("mongoose");
var offer=new mongoose.Schema({
	img:String,
	name:String,
	off:String,
	link:String
	
	
});
var Offer=mongoose.model("Offer",offer);

module.exports=Offer;