var mongoose =require("mongoose");
var passportLocalMongoose =require("passport-local-mongoose");
var userSchema = new mongoose.Schema(
	{
	    username:String,
	    password:String,
	    phone:Number,
	    email:String,
	    address:String,
		subTotal:Number,
		
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
		shipping:
		   {
		       shippingAddress:String,
		       shippingCity:String,
		       pincode:Number,
		       country:String,
			   paymentMethod:String
		    },
		wishlist:
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
	        Size:String,
			p_id:String,
			gen:String
			
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
			
		  }
		
		
		
    });
userSchema.plugin(passportLocalMongoose); 
var User=mongoose.model("User",userSchema);
module.exports=User;