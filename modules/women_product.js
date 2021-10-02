var mongoose=require("mongoose");

var women=new mongoose.Schema({
	
	       img:String,
		   pn:String,
		   pb:String,
		   price:Number,
		   rating:Number,
		   rev:Number,
		   qty:Number,
	       
	comments:
	[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Comment"
		}
	]
});

var Women=mongoose.model("Women",women);
module.exports=Women;