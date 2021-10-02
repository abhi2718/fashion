var mongoose=require("mongoose");
var cart= new mongoose.Schema({
	
	img:String,
	pn:String,
	pb:String,
	price:Number,
    rating:Number,
	rev:Number,
	qty:Number,
	cartQty:Number,
	Size:String
	
});
var Cart=mongoose.model("Cart",cart);
module.exports=Cart;
