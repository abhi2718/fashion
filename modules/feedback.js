var mongoose=require("mongoose");
var feed= new mongoose.Schema({
	myfeed:[{
	text:String,
	rating:Number,
	//date of creation of comment
	created:
	{
		type:Date,
		default:Date.now
	 },
	auther:
	{ 
		id:
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		name:String
	}
}]
})
			

var Feed=mongoose.model("Feed",feed);
module.exports=Feed;




