var express=require("express");
var app=express();
var port=process.env.PORT || 120;
var flash=require("connect-flash");
var count=0;
 var Wishcount=0;
// body-parser to change the form data into javascript object (var bodyparser=require("body-parser"));
var bodyParser=require("body-parser");
//https://protected-dawn-37261.herokuapp.com/cloths
// installing mongoose (i.e driver of mongodb) //mongoose.connect("mongodb://localhost/blog");
var mongoose=require("mongoose");

// schemas goes from here
var Men=require("./modules/men_product");
var Women=require("./modules/women_product");
var Offer=require("./modules/offer");
var Menfashion=require("./modules/index_menFashion");
var Womenfashion=require("./modules/index_womenFashion");
var Comment=require("./modules/comment_schema");
var Cart=require("./modules/mycart");
var Wish=require("./modules/wish");
var Order=require("./modules/order");
var Feed=require("./modules/feedback");
var Mycomment=
		{
			text:"",
			rating:""
		};
//========================================================================================================
//method_overide override the post method in delete and update method
  var methodOverride=require("method-override");
//========================================================================================================

// connecting to db
 mongoose.connect("mongodb://localhost/fashion");
// mongoose.connect("mongodb+srv://abhishek:maltisingh@cluster0-afkxv.mongodb.net/fashion?retryWrites=true&w=majority");
 var seedDB=require("./seed");
 seedDB();
//========================================================================================================

//user authentication section goes here

var passport=require("passport");
var passportLocalMongoose=require("passport-local-mongoose");
var LocalStrategy=require("passport-local");
var User=require("./modules/userSchema");

//=========================================================================================================

// using body-parser
  app.use(bodyParser.urlencoded({extended:true}));
// flash-message
  app.use(flash());
//using method-override to override the post request
  app.use(methodOverride("_method"));

//=========================================================================================================
//user authentication 
app.use(require("express-session")({
	secret:"ShivShankar",
	resave:false,
	saveUninitialized:false
}));
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//===========================================================================================================

// ++++++++++++++++++++++++++++++++++======== routes ======+++++++++++++++++++++++++++++++++++++++++++++++++++

//root route
app.get("/",function(req,res){
	res.render("landing.ejs");
});
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ index routes +++++++++++++++++++++++++++++++++++
app.get("/cloths",function(req,res){
	Offer.find({},function(err,found_offer){
		if(err)
			{
				console.log(err);
			}
		else
			{
				Menfashion.find({},function(err,found_menFashion){
					if(err)
						{
							console.log(err);
						}
					else
					{   
						Womenfashion.find({},function(err,found_womenFashion){
							if(err)
								{
									console.log(err);
								}
							else
								{
									res.render("index.ejs",
											   {
										          products:found_offer,
										          ps:found_menFashion,
										          ps1:found_womenFashion,
										          currentUser:req.user,
										          error:req.flash("error"),
										          success:req.flash("success"),
										          p_count:count,
										          w_count:Wishcount
									          });
								}
						});
						
					}
				});
				
			}
	});
	
});
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++index routes end here +++++++++++++++++++++++++++

//===========================================================register routes ===============================
app.get("/cloths/register",function(req,res){
		res.render("register.ejs",{
			                         currentUser:req.user,
								      error:req.flash("error"),
								      success:req.flash("success"),
								      p_count:count,
								      w_count:Wishcount
								  });
});
app.post("/cloths/register",function(req,res){
		User.register( new User({
			                       username:req.body.username,
								   email:req.body.email,
								   phone:req.body.phone,
								   address:req.body.add,
								   p_count:count,
			                       w_count:Wishcount
								}),
req.body.password,function(err, user){
		if(err)
			{   
				 var mess=err.message;
				 req.flash("error",mess);
				 console.log(err);
				 return res.redirect("/cloths/register");
			} 
		       
		         passport.authenticate("local")(req,res,function(){
			     res.redirect("/cloths");
		    });
	});
});
//====================================================register routes end here========================

//============================================== login routes ========================================
app.get("/cloths/login/:p_id/gender/:cat/size/:siz/qty/:qt",function(req,res){
		res.render("signin.ejs",
				   {
			          currentUser:req.user,
			          error:req.flash("error"),
			          success:req.flash("success"),
			          p_id:req.params.p_id,
			          cat:req.params.cat,
			          siz:req.params.siz,
			          qty:req.params.qt,
			          p_count:count,
			          w_count:Wishcount
		         });
});

app.post("/cloths/login/:p_id/gender/:cat/size/:siz/qty/:qt",passport.authenticate("local",
										{ 
										   failureRedirect:"/login/error"
										}),function(req,res){
	count=req.user.myCart.length;
	Wishcount=req.user.wishlist.length;
	if(req.params.p_id==="2718" )
		{   
			
			res.redirect("/cloths");
		}
	if(req.params.qt >=1)
		{    
			res.redirect("/cloths/cart/"+req.params.p_id+"/gender/"+req.params.cat+"/size/"+req.params.siz+"/qty/"+req.params.qt);
		}
	 
});
app.post("/cloths/loginForComment/:p_id/gender/:cat/size/:siz/qty/:qt",passport.authenticate("local",
										{ 
										   failureRedirect:"/login/error"
										}),function(req,res){
	                 count=req.user.myCart.length;
	                 Wishcount=req.user.wishlist.length;
	                 res.redirect("/cloths/"+req.params.p_id+"/gen/"+req.params.cat);
		});

app.get("/login/error",function(req,res){
	  req.flash("error"," Username or password is wrong");
	  res.redirect("/cloths/login/2718/gender/none/size/none/qty/0 ");
});

//***************************************** login routes end here*******************************************************

//====================================================User LogOut routes ===============================================
app.get("/cloths/logout",function(req,res){
	req.logout();
	count=0;
	Wishcount=0;
	res.redirect("/cloths");
});

//=====================================================
//middleware to check user is login or not /cloths/cart/<%= product._id %>/gender/women

function isLoggedIn(req,res,next){
	if(req.isAuthenticated())
		{   
			count=req.user.myCart.length;
		    Wishcount=req.user.wishlist.length;
			return next();   
		}
	else
		{
			
	       if(req.params.gen==="women" || "men" && req.body.qty >=0 )
		     {   
				
			    req.flash("error","Please login first");
	            res.redirect("/cloths/login/"+ req.params.p_id + "/gender/"+ req.params.gen+"/size/"+req.body.size+"/qty/"+req.body.qty);
		     }
	       else
		    {
			   req.flash("error","Please login first");
	           res.redirect(" /cloths/login/2718/gender/none/size/none/qty/0 ");
		    }
			
		}
}

function isLoggedInComment(req,res,next){
	if(req.isAuthenticated())
		{  
			count=req.user.myCart.length;
			Wishcount=req.user.wishlist.length;
			return next();   
		}
	else
		{
			if(req.params.cat==="women" || "men" )
		     {  
				
				 Mycomment.text=req.body.comment;
				 Mycomment.rating=req.body.rating;
				 req.flash("error","Please login first");
			     res.redirect("/cloths/login/"+ req.params.p_id + "/gender/"+ req.params.cat+"/size/comment/qty/1012");
			 }
			
		}
}

//==========================================product routes  ==========================================================
app.get("/cloths/shirts",function(req,res){
	
	
	Men.find({},function(err,found_men){
		if(err)
			{
				console.log(err);
			}
		else
			{
                
				res.render("shirt.ejs",
						   {
					          products:found_men,
					          currentUser:req.user,
					          error:req.flash("error"),
					          success:req.flash("success"),
					          p_count:count,
					          w_count:Wishcount
				           });
			}
	});
		
});

app.get("/cloths/lahnga",function(req,res){
	
	Women.find({},function(err,found_women){
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.render("lahnga.ejs",{
					                     products:found_women,
										 currentUser:req.user,
										 error:req.flash("error"),
										 success:req.flash("success"),
										  p_count:count,
					                      w_count:Wishcount
										});
			}
	});
	
	
});
//======================================================product routes end here========================================

// ===================================================show route ===================================================
app.get("/cloths/:cat/product/:id",function(req,res){
	// req.params.id is used to find the data inside params
	if(req.params.cat==="women")
		{
			Women.findById(req.params.id).populate("comments").exec(function(err,found_wp){
				if(err)
					{
						console.log(err);
					}
				else
					{    
						res.render("show_advance.ejs",
								   {
							         products:found_wp,
							         cat:req.params.cat,
							         currentUser:req.user,
							         error:req.flash("error"),
							         success:req.flash("success"),
							          p_count:count,
							          w_count:Wishcount
						            });
					}
			});
		}
	
	if(req.params.cat==="men")
		{
			Men.findById(req.params.id).populate("comments").exec(function(err,found_wp){
				if(err)
					{
						console.log(err);
					}
				else
					{   
						res.render("show_advance.ejs",
								   {
							         products:found_wp,
							         cat:req.params.cat,
							         currentUser:req.user,
							         error:req.flash("error"),
							         success:req.flash("success"),
							          p_count:count,
							          w_count:Wishcount
						           });
					}
			});
		}
	  
});
//========================================show routes end here ===============================================

//====================================creating comment routes================================================
app.post("/cloths/comment/:p_id/gender/:cat",isLoggedInComment,function(req,res){
	var comment=
		{
			text:req.body.comment,
			rating:req.body.rating
		};
	 if(req.params.cat==="women")
		{
			Women.findById(req.params.p_id,function(err,found_wp){
				if(err)
					{
						console.log(err);
					}
				else
					{
						Comment.create(comment,function(err,comm){
							if(err)
								{
									console.log(err);
								}
							else
								{     
									//add usename and id to comment
							         comm.auther.id=req.user._id;
							         comm.auther.name=req.user.username;
							         comm.save();
							         //save comment
									 
									 //pushing the comment refrence to comments array
									 found_wp.comments.push(comm);
							         found_wp.save();
							         req.flash("success","Successfully added Your's comment");
							         res.redirect("/cloths/comment/"+ req.params.p_id +"/review/women");
									 
								}
							});
				}
			});
		}
	if(req.params.cat==="men")
		{
			
			Men.findById(req.params.p_id,function(err,found_wp){
				if(err)
					{
						console.log(err);
					}
				else
					{
						Comment.create(comment,function(err,comm){
							if(err)
								{
									console.log(err);
								}
							else
								{     
									     //add usename and id to comment
							             comm.auther.id=req.user._id;
							             comm.auther.name=req.user.username;
							             comm.save();
							             //save comment
									     //pushing the comment refrence to comments array
									     found_wp.comments.push(comm);
							             found_wp.save();
							             req.flash("success","Successfully added Your's comment");
							             res.redirect("/cloths/comment/"+ req.params.p_id +"/review/men");
									    
								}
							
							});		
					}
			});
		}
	
});
app.get("/cloths/:p_id/gen/:cat",function(req,res){
	  
	var comment=
		{
			text:Mycomment.text,
			rating:Mycomment.rating
		};
	 if(req.params.cat==="women")
		{
			Women.findById(req.params.p_id,function(err,found_wp){
				if(err)
					{
						console.log(err);
					}
				else
					{
						Comment.create(comment,function(err,comm){
							if(err)
								{
									console.log(err);
								}
							else
								{     
									//add usename and id to comment
							         comm.auther.id=req.user._id;
							         comm.auther.name=req.user.username;
							         comm.save();
							         //save comment
									 
									 //pushing the comment refrence to comments array
									 found_wp.comments.push(comm);
							         found_wp.save();
							         req.flash("success","Successfully added Your's comment");
							         res.redirect("/cloths/comment/"+ req.params.p_id +"/review/women");
									 
								}
							});
					   }
			});
		}
	if(req.params.cat==="men")
		{
			
			Men.findById(req.params.p_id,function(err,found_wp){
				if(err)
					{
						console.log(err);
					}
				else
					{
						Comment.create(comment,function(err,comm){
							if(err)
								{
									console.log(err);
								}
							else
								{     
									     //add usename and id to comment
							             comm.auther.id=req.user._id;
							             comm.auther.name=req.user.username;
							             comm.save();
							             //save comment
									     //pushing the comment refrence to comments array
									     found_wp.comments.push(comm);
							             found_wp.save();
							             req.flash("success","Successfully added Your's comment");
							             res.redirect("/cloths/comment/"+ req.params.p_id +"/review/men");
									    
								}
							
							});		
					}
			});
		}
	
});
// =============================================Edit comment =========================================
app.get("/cloths/editComment/:comment_id/product/:p_id/gender/:gen",function(req,res){
	Comment.findById(req.params.comment_id,function(err,comment){
        res.render("editComment.ejs",
								   {
							          comment:comment,
			                          com_id:req.params.comment_id,
							          p_id:req.params.p_id,
			                          cat:req.params.gen,
							          currentUser:req.user,
							          error:req.flash("error"),
							          success:req.flash("success"),
						           	  p_count:count,
			                           w_count:Wishcount
						            });
	});
});
app.put("/cloths/editComment/:comment_id/product/:p_id/gender/:gen",function(req,res){
	Comment.updateOne({_id:req.params.comment_id},{text:req.body.text},function(err,updated){
		if(err)
			{
				res.json(err);
			}
		else
			{     
				res.redirect("/cloths/comment/" + req.params.p_id + "/review/" + req.params.gen);
			}
	});
});
//deleting the comment
app.delete("/cloths/comment/:comment_id/delete/:cat",function(req,res){
	Comment.remove({_id:req.params.comment_id},function(err,del){
		if(err)
			{
				res.json(err);
			}
		else
			{    
				res.redirect("back");
			}
	});
});
//============================================comment routes end here========================================

//  ====================================================review routes========================================
app.get("/cloths/comment/:p_id/review/:cat",function(req,res){
	if(req.params.cat==="women")
		{
			Women.findById(req.params.p_id).populate("comments").exec(function(err,found_wp){
				if(err)
					{
						console.log(err);
					}
				else
					{    
						res.render("review.ejs",
								   {
							          products:found_wp,
							          cat:req.params.cat,
							          currentUser:req.user,
							          error:req.flash("error"),
							          success:req.flash("success"),
						           	  p_count:count,
							           w_count:Wishcount
						            });
					}
			});
		}
	
	if(req.params.cat==="men")
		{
			Men.findById(req.params.p_id).populate("comments").exec(function(err,found_wp){
				if(err)
					{
						console.log(err);
					}
				else
					{    console.log(found_wp);
						res.render("review.ejs",
								   {
							          products:found_wp,
							          cat:req.params.cat,
							          currentUser:req.user,
							          error:req.flash("error"),
							          success:req.flash("success"),
							          p_count:count,
							          w_count:Wishcount
						           });
					}
			});
		}
	 
	
});
 //============================================ review routes end here=======================================

// ============================================add to cart routes============================================
app.get("/cloths/cart/:p_id/gender/:gen/size/:siz/qty/:qt",function(req,res){
	path=0;
	User.findById(req.user._id,function(err,foundUser){
		if(err)
			{
				console.log(err)
			}
		else
			{
				   if(req.params.gen==="women")
		            {
		               	Women.findById(req.params.p_id,function(err,found_wp){
							
			        	if(err)
					   {
						    console.log(err);
					   }
							
				     else
					    {  
						    var myCart=
								{
									img:found_wp.img,
	                                 pn:found_wp.pn,
	                                 pb:found_wp.pb,
	                                 price:found_wp.price,
									 rating:found_wp.rating,
									 rev:found_wp.rev,
									 qty:found_wp.qty,
	                                 cartQty:req.params.qt,
	                                 Size:req.params.siz
								}
							             count=req.user.myCart.length+1;
										//pushing the product in mycart
							             foundUser.myCart.push(myCart);
							             foundUser.save(); 
								     	 res.redirect("/cloths/mycart");
						  }    
			        });
						
		            }
	
	             if(req.params.gen==="men")
		          {
			        Men.findById(req.params.p_id,function(err,found_wp){
				    if(err)
					  {
						console.log(err);
					  }
				   else
					  {   
						    var myCart=
								{
									img:found_wp.img,
	                                 pn:found_wp.pn,
	                                 pb:found_wp.pb,
	                                 price:found_wp.price,
									 rating:found_wp.rating,
									 rev:found_wp.rev,
									 qty:found_wp.qty,
	                                 cartQty:req.params.qt,
	                                 Size:req.params.siz
								}
							          count=req.user.myCart.length+1;
									//pushing the product in mycart 
							          foundUser.myCart.push(myCart);
							          foundUser.save();
						              res.redirect("/cloths/mycart");
						             
											
						} 
						
			          });
		          }
			}
	});
	
});
app.post("/cloths/cart/:p_id/gender/:gen",isLoggedIn,function(req,res){
	   path=0;
	   User.findById(req.user._id,function(err,foundUser){
		if(err)
			{
				console.log(err)
			}
		else
			{
				   if(req.params.gen==="women")
		            {
		               	Women.findById(req.params.p_id,function(err,found_wp){
							
			        	if(err)
					   {
						    console.log(err);
					   }
							
				     else
					    {  
						    var myCart=
								{
									img:found_wp.img,
	                                 pn:found_wp.pn,
	                                 pb:found_wp.pb,
	                                 price:found_wp.price,
									 rating:found_wp.rating,
									 rev:found_wp.rev,
									 qty:found_wp.qty,
	                                 cartQty:req.body.qty,
	                                 Size:req.body.size
								}
							              count=req.user.myCart.length+1;
										//pushing the product in mycart
							             foundUser.myCart.push(myCart);
							             foundUser.save();
							             res.redirect("/cloths/mycart");
										 
							}    
			        });
						
		            }
	
	             if(req.params.gen==="men")
		          {
			        Men.findById(req.params.p_id,function(err,found_wp){
				    if(err)
					  {
						console.log(err);
					  }
				   else
					  {   
						    var myCart=
								{
									img:found_wp.img,
	                                 pn:found_wp.pn,
	                                 pb:found_wp.pb,
	                                 price:found_wp.price,
									 rating:found_wp.rating,
									 rev:found_wp.rev,
									 qty:found_wp.qty,
	                                 cartQty:req.body.qty,
	                                 Size:req.body.size
								}
							              count=req.user.myCart.length+1;
										//pushing the product in mycart
							             foundUser.myCart.push(myCart);
							             foundUser.save();
							             res.redirect("/cloths/mycart");
										 
						}
						
			          });
		          }
			}
	});
});

function isLoggedInForCart(req,res,next){
	if(req.isAuthenticated())
		{  
			count=req.user.myCart.length;
			Wishcount=req.user.wishlist.length;
			return next();   
		}
	else
		{   
			req.flash("error","Please login first");
			res.render("mycart_login.ejs",{
				                             currentUser:req.user,
							                 error:req.flash("error"),
							                 success:req.flash("success"),
				                             p_count:count,
				                             w_count:Wishcount
			                              });
		}
};
app.post("/cloths/mycart",passport.authenticate("local",
										{ 
										   failureRedirect:"/cloths/err"
										}),function(req,res){
	                                   count=req.user.myCart.length;
	                                   Wishcount=req.user.wishlist.length;
	                                   res.redirect("/cloths/mycart");
	 });
app.get("/cloths/err",function(req,res){
	req.flash("error","Password Or Username is wrong");
	res.render("mycart_login.ejs",{
				                             currentUser:req.user,
							                 error:req.flash("error"),
							                 success:req.flash("success"),
				                             p_count:count,
				                             w_count:Wishcount
			                              });
});
// mycart
app.get("/cloths/mycart",isLoggedInForCart,function(req,res){
	User.findById(req.user._id,function(err,found_wp){
				if(err)
					{
						console.log(err);
					}
				else
				{
					var subTotal=0;
					found_wp.myCart.forEach(function(data){
						subTotal=subTotal+ data.cartQty * data.price;
					});
				    res.render("cart.ejs",{
					                         cart:found_wp.myCart,
										     currentUser:req.user,
										     error:req.flash("error"),
										     success:req.flash("success"),
										     p_count:count,
						                     total:subTotal,
						                     w_count:Wishcount
										});
				}
			});
	
});
app.get("/cloths/delete/:p_id",function(req,res){
	User.findById(req.user._id,function(err,found_wp){
				if(err)
					{
						console.log(err);
					}
				else
				{        
					var product_id=req.params.p_id;
					var user_id=req.user._id;
				    User.findByIdAndUpdate(
                        user_id,
                    { $pull: { 'myCart': {  _id: product_id } } },function(err,model){
                    if(err){
                    	console.log(err);
                    	return res.send(err);
                        }
						else
							{  
							  count=count-1;	
							  res.redirect("back");
							}
						 
                     });
					
				}
			});
	
});
// increase and decrease of qty
app.get("/cloths/increase/:p_id/Qty/:qty",function(req,res){
	User.findById(req.user._id,function(err,found_wp){
				if(err)
					{
						console.log(err);
					}
				else
				{ 
					var pc= Number(req.params.qty) + 1;
					User.update({'myCart._id':req.params.p_id},
                    {'$set': {
                       'myCart.$.cartQty': pc ,
	                  }},
                   function(err,model) {
	            	if(err){
        	                  console.log(err);
        	                  return res.send(err);
                           }
                            res.redirect("back");
                        });
					
				}
	});
});
app.get("/cloths/decrease/:p_id/Qty/:qty",function(req,res){
	User.findById(req.user._id,function(err,found_wp){
				if(err)
					{
						console.log(err);
					}
				else
				    {     
						var pc= Number(req.params.qty) - 1;
						if(pc>=1)
						{
					     User.update({'myCart._id':req.params.p_id},
                         {'$set': {
                       'myCart.$.cartQty': pc ,
	                     }},
                         function(err,model) {
	            	    if(err){
        	                  console.log(err);
        	                  return res.send(err);
                           }
                            res.redirect("back");
                          });
					
						}
						else
							{
								res.redirect("back");
							}
				    }
	});
});
//=====================================add to cart routes end here=====================================

//====================================== add to wishlist=====================================================
var p_id="";
var gen="";
function isLoggedInForWish(req,res,next){
	if(req.isAuthenticated())
		{  
			count=req.user.myCart.length;
			Wishcount=req.user.wishlist.length;
			return next();   
		}
	else
		{   p_id=req.params.p_id;
		    gen=req.params.gen;
			req.flash("error","Please login first");
			res.render("login_forWishlist.ejs",{
				                                 currentUser:req.user,
							                     error:req.flash("error"),
							                     success:req.flash("success"),
				                                 p_count:count,
				                                 w_count: Wishcount,
				                                 p_id:req.params.p_id,
				                                 gen:req.params.gen
			                              });
		}
};

app.post("/cloths/mywish/:p_id/gen/:gen",passport.authenticate("local",
										{ 
										   failureRedirect:"/cloths/error"
	                                       
										}),function(req,res){
	                                   count=req.user.myCart.length;
	                                   Wishcount=req.user.wishlist.length;
	                                   res.redirect("/cloths/wishlist/"+req.params.p_id+"/gender/"+req.params.gen);
	 });
app.get("/cloths/error",function(req,res){
	req.flash("error","Password Or Username is wrong");
	res.render("login_forWishlist.ejs",{
				                                 currentUser:req.user,
							                     error:req.flash("error"),
							                     success:req.flash("success"),
				                                 p_count:count,
				                                 w_count: Wishcount,
				                                 p_id:p_id,
				                                 gen:gen
			                              });
});
app.get("/cloths/wishlist/:p_id/gender/:gen",isLoggedInForWish,function(req,res){
	User.findById(req.user._id,function(err,foundUser){
		if(err)
			{
				console.log(err)
			}
		else
			{
				   if(req.params.gen==="women")
		            {
		               	Women.findById(req.params.p_id,function(err,found_wp){
							
			        	if(err)
					   {
						    console.log(err);
					   }
							
				     else
					    {  
						    var myCart=
								{
									img:found_wp.img,
	                                 pn:found_wp.pn,
	                                 pb:found_wp.pb,
	                                 price:found_wp.price,
									 rating:found_wp.rating,
									 rev:found_wp.rev,
									 qty:found_wp.qty,
	                                 cartQty:"1",
	                                 Size:"x",
									 p_id:req.params.p_id,
									 gen:"women"
								}
							            Wishcount=req.user.wishlist.length+1;
										//pushing the product in wishlist
							             foundUser.wishlist.push(myCart);
							             foundUser.save();
							             res.redirect("/cloths/mywishlist");
										 
							}    
			        });
						
		            }
	
	             if(req.params.gen==="men")
		          {
			        Men.findById(req.params.p_id,function(err,found_wp){
				    if(err)
					  {
						console.log(err);
					  }
				   else
					  {   
						    var myCart=
								{
									img:found_wp.img,
	                                 pn:found_wp.pn,
	                                 pb:found_wp.pb,
	                                 price:found_wp.price,
									  rating:found_wp.rating,
									 rev:found_wp.rev,
									 qty:found_wp.qty,
	                                 cartQty:"1",
	                                 Size:"x",
									 p_id:req.params.p_id,
									 gen:"men"
								}
							             Wishcount=req.user.wishlist.length+1;
										//pushing the product in wishlist
							             foundUser.wishlist.push(myCart);
							             foundUser.save();
							             res.redirect("/cloths/mywishlist");
										  
						}
						
			          });
		          }
			}
	});
});
function isLoggedInForWishlist(req,res,next){
	if(req.isAuthenticated())
		{  
			count=req.user.myCart.length;
			Wishcount=req.user.wishlist.length;
			return next();   
		}
	else
		{ 
			req.flash("error","Please login first");
			 res.render("loginForWish.ejs",{
					                        
										     currentUser:req.user,
										     error:req.flash("error"),
										     success:req.flash("success"),
										     p_count:count,
						                     w_count:Wishcount
						                     
										});
		}
};
app.post("/cloths/mywishlist",passport.authenticate("local",
										{ 
										   failureRedirect:"/cloths/Wisherr"
										}),function(req,res){
	                                   count=req.user.myCart.length;
	                                   Wishcount=req.user.wishlist.length;
	                                   res.redirect("/cloths/mywishlist");
	 });
app.get("/cloths/Wisherr",function(req,res){
	req.flash("error","Password Or Username is wrong");
	res.render("loginForWish.ejs",{
				                             currentUser:req.user,
							                 error:req.flash("error"),
							                 success:req.flash("success"),
				                             p_count:count,
				                             w_count:Wishcount
			                              });
});
app.get("/cloths/mywishlist",isLoggedInForWishlist,function(req,res){
	User.findById(req.user._id,function(err,found_wp){
				if(err)
					{
						console.log(err);
					}
				else
				{
					
				    res.render("wishlist.ejs",{
					                         wish:found_wp.wishlist,
										     currentUser:req.user,
										     error:req.flash("error"),
										     success:req.flash("success"),
										     p_count:count,
						                     w_count:Wishcount
						                     
										});
				}
			});
	
});
app.get("/cloths/deleteWishlist/:p_id",function(req,res){
	User.findById(req.user._id,function(err,found_wp){
				if(err)
					{
						console.log(err);
					}
				else
				{        
					var product_id=req.params.p_id;
					var user_id=req.user._id;
				    User.findByIdAndUpdate(
                        user_id,
                    { $pull: { 'wishlist': {  _id: product_id } } },function(err,model){
                    if(err){
                    	console.log(err);
                    	return res.send(err);
                        }
						else
							{  
							  Wishcount=Wishcount-1;	
							  res.redirect("back");
							}
						 
                     });
					
				}
			});
	
});
app.get("/cloths/wishlistTocart/:p_id/data/:data_id/gen/:gen",function(req,res){
	User.findById(req.user._id,function(err,found_wp){
				if(err)
					{
						console.log(err);
					}
				else
				{        
					var product_id=req.params.data_id;
					var user_id=req.user._id;
				    User.findByIdAndUpdate(
                        user_id,
                    { $pull: { 'wishlist': {  _id: product_id } } },function(err,model){
                    if(err){
                    	console.log(err);
                    	return res.send(err);
                        }
						else
							{  
							  Wishcount=Wishcount-1;	
							  res.redirect("/cloths/cart/"+req.params.p_id+"/gender/"+req.params.gen+"/size/x/qty/1");
							}
						 
                     });
					
				}
			});
});
//============================================= add to wishlist end here ===========================================

//======================================================== checkout routes ======================================
app.get("/cloths/checkout",function(req,res){
	 path=0;
	res.render("checkout.ejs",{
							          currentUser:req.user,
							          error:req.flash("error"),
		                              p_count:count,
		                              w_count:Wishcount,
							          success:req.flash("success")
						           });
	
});
app.get("/cloths/check",function(req,res){
	 path=1;
	res.render("checkout.ejs",{
							          currentUser:req.user,
							          error:req.flash("error"),
		                              p_count:count,
		                              w_count:Wishcount,
							          success:req.flash("success")
						           });
	
});
app.post("/cloths/checkout",function(req,res){
	User.findById(req.user._id,function(err,found_user){
				if(err)
					{
						console.log(err);
					}
				else
				    {  
						var user_data=
							{
								shippingAddress:req.body.shippingAddress,
								shippingCity:req.body.shippingCity,
		                        pincode:req.body.pinCode,
		                        country:req.body.country
								
							 }
					
						 found_user.shipping=user_data;
		                 found_user.save();
					     res.render("payment.ejs",
								   {
							             currentUser:req.user,
										 error:req.flash("error"),
										 success:req.flash("success"),
										 p_count:count,
							             userdata:found_user,
							             w_count:Wishcount
						                 
						            });
					}
	});
});
app.post("/cloths/payment",function(req,res){
	User.findById(req.user._id,function(err,found_user){
				if(err)
					{ 
						console.log(err);
					}
				else
				     {
						 if(path===0)
						    {
								var subTotal=0;
						        var total=0;
					            found_user.myCart.forEach(function(data){
						        subTotal=subTotal+ data.cartQty * data.price;
					            });
						        total=subTotal+25.25;
					     	    found_user.shipping.paymentMethod=req.body.paymethod;
								found_user.subTotal=total;
					     	    found_user.save();
						        res.render("placeOrder.ejs",{
							             currentUser:req.user,
										 error:req.flash("error"),
										 success:req.flash("success"),
										 p_count:count,
							             w_count:Wishcount,
							             order:found_user,
							             subTotal:subTotal,
							             total:total,
									     path:path
						          });
							}
						 if(path===1)
						    {
								 var subTotal=found_user.buy_now.price;
						         var total=0;
					            
						        total=subTotal+25.25;
								found_user.subTotal=total;
					     	    found_user.shipping.paymentMethod=req.body.paymethod;
					     	    found_user.save();
						        res.render("placeOrder.ejs",{
							             currentUser:req.user,
										 error:req.flash("error"),
										 success:req.flash("success"),
										 p_count:count,
							             w_count:Wishcount,
							             order:found_user,
							             subTotal:subTotal,
							             total:total,
									     path:path
						          });
								
							}
						
					}
	});
});

app.get("/cloths/payment",function(req,res){
	User.findById(req.user._id,function(err,found_user){
				if(err)
					{
						console.log(err);
					}
				else
				    {  
						if(path===0)
							{
						       var subTotal=0;
						       var total=0;
					            found_user.myCart.forEach(function(data){
						         subTotal=subTotal+ data.cartQty * data.price;
					            });
								 console.log("Hi This is user");
								 console.log(found_user);
						         total=subTotal+25.25; 
								 found_user.subTotal=total;
								 found_user.save();
						         res.render("orderDetail.ejs",{
							             currentUser:req.user,
										 error:req.flash("error"),
										 success:req.flash("success"),
										 p_count:count,
							             w_count:Wishcount,
							             order:found_user,
							             subTotal:subTotal,
							             total:total,
									     path:path
						         });
							}
						if(path===1)
							{
								var subTotal=found_user.buy_now.price;
						        var total=0;
								var mypath=path;
					             path=0;
						        total=subTotal+25.25;
								price=total;
					     	    found_user.shipping.paymentMethod=req.body.paymethod;
								found_user.subTotal=total;
					     	    found_user.save();
								console.log("Hi This is user");
					        	console.log(found_user);
						        res.render("orderDetail.ejs",{
							             currentUser:req.user,
										 error:req.flash("error"),
										 success:req.flash("success"),
										 p_count:count,
							             w_count:Wishcount,
							             order:found_user,
							             subTotal:subTotal,
							             total:total,
									     path:mypath
						          });
								
							}
					}
	});
});

//===============================================buy now start===========================================
var P_ID="";
var Gen="";
var path=0;
var Cqty=0;
function isLoggedInForBuyNow(req,res,next){
	if(req.isAuthenticated())
		{  
			count=req.user.myCart.length;
			Wishcount=req.user.wishlist.length;
			return next();   
		}
	else
		{ 
			P_ID=req.params.p_id;
		    Gen=req.params.gen;			
            Cqty=req.body.qty;
			siz=req.body.size;
			req.flash("error","Please login first");
			res.render("login_forBuyNow.ejs",{
				                                 currentUser:req.user,
							                     error:req.flash("error"),
							                     success:req.flash("success"),
				                                 p_count:count,
				                                 w_count: Wishcount,
				                                 p_id:req.params.p_id,
				                                 gen:req.params.gen
			                              });
		}
};

app.post("/cloths/buyNow/:p_id/gen/:gen",passport.authenticate("local",
										{ 
										   failureRedirect:"/cloths/myerror"
	                                       
										}),function(req,res){
	                                   count=req.user.myCart.length;
	                                   Wishcount=req.user.wishlist.length;
	                                   res.redirect("/cloths/buyNow/"+req.params.p_id+"/gender/"+req.params.gen);
	 });
app.get("/cloths/myerror",function(req,res){
	req.flash("error","Password Or Username is wrong");
	res.render("login_forBuyNow.ejs",{
				                                 currentUser:req.user,
							                     error:req.flash("error"),
							                     success:req.flash("success"),
				                                 p_count:count,
				                                 w_count: Wishcount,
				                                 p_id:P_ID,
				                                 gen:Gen
			                              });
});
var path=0;

    app.post("/cloths/buyNow/:p_id/gender/:gen",isLoggedInForBuyNow,function(req,res){
		  path=1;
		User.findById(req.user._id,function(err,foundUser){
		if(err)
			{
				console.log(err)
			}
		else
			{
				   if(req.params.gen==="women")
		            {
		               	Women.findById(req.params.p_id,function(err,found_wp){
							
			        	if(err)
					   {
						    console.log(err);
					   }
							
				     else
					    {  
						    var myCart=
								{
									img:found_wp.img,
	                                 pn:found_wp.pn,
	                                 pb:found_wp.pb,
	                                 price:found_wp.price,
									 rating:found_wp.rating,
									 rev:found_wp.rev,
									 qty:found_wp.qty,
	                                 cartQty:req.body.qty,
	                                 Size:req.body.size,
									 p_id:req.params.p_id,
									 gen:"women"
								}
							            foundUser.buy_now=myCart;
		                                foundUser.save();
							            res.redirect("/cloths/check");
										 
							}    
			        });
						
		            }
	
	             if(req.params.gen==="men")
		          {
			        Men.findById(req.params.p_id,function(err,found_wp){
				    if(err)
					  {
						console.log(err);
					  }
				   else
					  {   
						    var myCart=
								{
									img:found_wp.img,
	                                 pn:found_wp.pn,
	                                 pb:found_wp.pb,
	                                 price:found_wp.price,
									  rating:found_wp.rating,
									 rev:found_wp.rev,
									 qty:found_wp.qty,
									 cartQty:req.body.qty,
	                                 Size:req.body.size,
									 p_id:req.params.p_id,
									 gen:"men"
								}
							            
							            foundUser.buy_now=myCart;
		                                foundUser.save();
						                console.log(foundUser.buy_now);
							            res.redirect("/cloths/check");   
										  
						}
						
			          });
		          }
			}
	});
		
	});

app.get("/cloths/buyNow/:p_id/gender/:gen",function(req,res){
		  path=1;
		User.findById(req.user._id,function(err,foundUser){
		if(err)
			{
				console.log(err)
			}
		else
			{
				   if(req.params.gen==="women")
		            {
		               	Women.findById(req.params.p_id,function(err,found_wp){
							
			        	if(err)
					   {
						    console.log(err);
					   }
							
				     else
					    {  
						    var myCart=
								{
									img:found_wp.img,
	                                 pn:found_wp.pn,
	                                 pb:found_wp.pb,
	                                 price:found_wp.price,
									 rating:found_wp.rating,
									 rev:found_wp.rev,
									 qty:found_wp.qty,
	                                 cartQty:Cqty,
	                                 Size:siz,
									 p_id:req.params.p_id,
									 gen:"women"
								}
							            foundUser.buy_now=myCart;
		                                foundUser.save();
							            res.redirect("/cloths/check");
										 
							}    
			        });
						
		            }
	
	             if(req.params.gen==="men")
		          {
			        Men.findById(req.params.p_id,function(err,found_wp){
				    if(err)
					  {
						console.log(err);
					  }
				   else
					  {   
						    var myCart=
								{
									img:found_wp.img,
	                                 pn:found_wp.pn,
	                                 pb:found_wp.pb,
	                                 price:found_wp.price,
									  rating:found_wp.rating,
									 rev:found_wp.rev,
									 qty:found_wp.qty,
									 cartQty:Cqty,
	                                 Size:siz,
									 p_id:req.params.p_id,
									 gen:"men"
								}
							            
							            foundUser.buy_now=myCart;
		                                foundUser.save();
						                console.log(foundUser.buy_now);
							            res.redirect("/cloths/check");   
										  
						}
						
			          });
		          }
			}
	});
		
	});




//===============================================buy now end=============================================
 //=============================================Payment Gateway start ============================================
var orderId="";
app.get("/cloths/order",function(req,res){
	User.findById(req.user._id,function(err,foundUser){
		if(err)
			{
				console.log(err)
			}
    else
	{ 
		var userOrder=
			{
			  userId:req.user._id,
			  myCart:foundUser.myCart,
			  buy_now:foundUser.buy_now,
			  price:foundUser.subTotal
					  
		    }
		Order.create(userOrder,function(err,order){
			if(err)
				{
					console.log(err);
				}
			else
				{
					orderId=order._id;
					console.log("hi abhi");
					console.log(orderId);
					res.redirect("/payment");
				}
		});
	}
	});
});

app.post("/success",function(req,res){
	
	res.send("Your order is on the way");
});

const checksum_lib=require("./paytm/checksum/checksum"); 
	app.get("/payment",(req,res)=>{
	
		User.findById(req.user._id,function(err,foundUser){
		if(err)
			{
				console.log(err)
			}
    else
	{ 
		var userId=req.user._id;
		var email=foundUser.email;
		var phone=foundUser.phone;
		var price=0;
		 price=foundUser.subTotal;
		
		let params={};
		 params.MID ='yBjUVz38928765114424',
		 params['WEBSITE']='WEBSTAGING',
	     params['CHANNEL_ID']='WEB',
		 params['INDUSTRY_TYPE_ID']='Retail',
		 params['ORDER_ID']=''+orderId,
		 params['CUST_ID']=''+userId,
		 params['TXN_AMOUNT']=''+price;
		 params['CALLBACK_URL']='http://localhost:'+port+'/success',
		 params['EMAIL']=''+email,
		 params['MOBILE_NO']=''+phone
		
		checksum_lib.genchecksum(params,'Wy##YhL37TuCWzAK',function(err,checksum){
			let txn_url="https://securegw-stage.paytm.in/order/process";
			
			
			let form_fields="";
			for(x in params)
				{
					 form_fields+="<input type='hidden' name='" +x+ "' value='" +params[x] +"' />";
				}
			form_fields+="<input type='hidden' name='CHECKSUMHASH' value='"+checksum+"'/> ";
			
			var html='<html><body><center><h1>Please waite do not refresh the page</h1></center><form method="post" action=" '+txn_url+' " name="f1">'+form_fields +'</form> <script type="text/javascript">document.f1.submit()</script></body></html>';
			
			res.writeHead(200,{'Content-Type':'text/html'});
			res.write(html);
			res.end();
			
		       })
	   }
});
		
		
		
	});




//=============================================Payment Gateway end========================================


app.listen(port,function(){
	console.log("port 120 is ready to serve");
});