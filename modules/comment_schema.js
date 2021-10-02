var mongoose=require("mongoose");
var comment= new mongoose.Schema({
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
});

var Comment=mongoose.model("Comment",comment);
module.exports=Comment;




