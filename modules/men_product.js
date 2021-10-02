var mongoose=require("mongoose"); 

var men=new mongoose.Schema({
	
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

var Men=mongoose.model("Men",men);
module.exports=Men;