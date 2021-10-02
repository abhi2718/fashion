var mongoose=require("mongoose");
var order=new mongoose.Schema({
	          userId:String,
			  myCart:
	                [
						{
			               img:String,
	                        pn:String,
	                        pb:String,
	                        price:Number,
                            rating:Number,
	                        rev:Number,
	                        qty:Number,
	                        cartQty:Number,
	                        Size:String
			
		                }
					],
			  buy_now:
		            {
			          img:String,
	                  pn:String,
	                  pb:String,
	                  price:Number,
                      rating:Number,
	                  rev:Number,
	                  qty:Number,
	                  cartQty:Number,
	                  Size:String,
			          p_id:String,
			          gen:String
			
		           },
			  price:String
	
	
});
var Order=mongoose.model("Order",order);

module.exports=Order;