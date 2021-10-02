var mongoose=require("mongoose");
var wish=new mongoose.Schema({
	
		wishlist:
		
			{   
				userId:String,
			    img:String,
	             pn:String,
	             pb:String,
	             price:Number,
                 rating:Number,
	             rev:Number,
	             qty:Number,
	             cartQty:Number,
	             Size:String,
				 gen:String
			
		  }
		 
	
	
});
var Wish=mongoose.model("Wish",wish);

module.exports=Wish;