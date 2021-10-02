var mongoose=require("mongoose");
var Men=require("./modules/men_product");
var Women=require("./modules/women_product");
var Offer=require("./modules/offer");
var Menfashion=require("./modules/index_menFashion");
var Womenfashion=require("./modules/index_womenFashion");
var Comment=require("./modules/comment_schema");
// men product array
var product_array=[
	 {
		   img:"https://images-na.ssl-images-amazon.com/images/I/6144pVSzCgL._UX522_.jpg",
		   pn:" Plain Shirt",
		   pb:"Fast Fashions",
		   price:"4000",
		   rating:4,
		   rev:6,
		   qty:1
	   },
	   {
		   img:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQlD82MPderVi_QsHh3UWlwK4T3O4EJZnkunw&usqp=CAU",
		   pn:"Full Shirt",
		   pb:"Ethnic Emp",
		   price:"1600",
		   rating:4.5,
		   rev:3,
		   qty:1
	   },
	   {
		   img:"https://images-na.ssl-images-amazon.com/images/I/916bHFDRGfL._UY500_.jpg",
		   pn:"Formal Shirt",
		   pb:"shiva fashion",
		   price:"5000",
		   rating:4,
		   rev:5,
		   qty:1
	   },
	   
	   {
		   img:"https://images-na.ssl-images-amazon.com/images/I/71k1KPNsw3L._UY500_.jpg",
		   pn:" Slim Shirt ",
		   pb:"Vans Fashion ",
		   price:"800",
		   rating:4,
		   rev:5,
		   qty:1
	   },
	   {
		   img:"https://images-na.ssl-images-amazon.com/images/I/71hE5k-1f5L._UY500_.jpg ",
		   pn:"Full Shirt",
		   pb:"Marli men's",
		   price:"400",
		   rating:4.5,
		   rev:5,
		   qty:1
	   }
	
	
	
];

// women's product array
   var product_array3=[
	   {
		   img:"https://m.media-amazon.com/images/I/41oXxusEtOL._AC_SR160,200_.jpg",
		   pn:" Line Kurta",
		   pb:"Fast Fashions",
		   price:"4000",
		   rating:4,
		   rev:6,
		   qty:1
	   },
	   {
		   img:"https://images-na.ssl-images-amazon.com/images/I/81SjRV%2BBLkL._UY741_.jpg",
		   pn:"Salwar Suit",
		   pb:"Ethnic Emp ",
		   price:"1600",
		   rating:4.5,
		   rev:3,
		   qty:1
	   },
	   {
		   img:"https://images-eu.ssl-images-amazon.com/images/I/6101GQWVHEL._AC_UL320_SR256,320_.jpg",
		   pn:"Lehenga Choli",
		   pb:"shiva fashion",
		   price:"5000",
		   rating:4,
		   rev:5,
		   qty:1
	   },
	   {
		   img:"https://images-eu.ssl-images-amazon.com/images/I/91FX0tRh1tL._AC_UL320_SR240,320_.jpg",
		   pn:" Lehenga Choli",
		   pb:"Ethnic Emp ",
		   price:"2000",
		   rating:4.5,
		   rev:3,
		   qty:1
	   },
	   {
		   img:"https://images-eu.ssl-images-amazon.com/images/I/91SqH5e2GQL._AC_UL320_SR214,320_.jpg",
		   pn:" Kalamkari Sarees ",
		   pb:"Vns Fashion ",
		   price:"800",
		   rating:4,
		   rev:5,
		   i:4
	   },
	   {
		   img:"https://images-na.ssl-images-amazon.com/images/I/61XZyUak-tL._UX679_.jpg",
		   pn:"Salwar Suit",
		   pb:"Marl Women's",
		   price:"400",
		   rating:4,
		   rev:5,
		   qty:1
	   }
   ];

//offer section

var product_array1=[{
	img:"https://images-eu.ssl-images-amazon.com/images/I/81nCWvfAEHL._AC_UL320_SR244,320_.jpg",
	name:"Women's Fashion",
	off:"50",
	link:"/cloths/lahnga"
},
{
	img:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQhBswTdOBmOqWw7gYKwukGGqumexAMVIq0EQ&usqp=CAU",
	name:"Men's Fashion",
	off:"40",
	link:"/cloths/shirts"
},
{
	img:"https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcThCB3KYJ_LwLqfQDDTRPhxc2ZOX9otzzJPeiY1nnFI-5aCUYM0wxgwEQkMlAbA-ZeS78To9K5CXBp0bgtMlphCMkFHMfPmyc9Im_F_qQfvaI9pV8OCeQZ-oA&usqp=CAE",
	name:"Men's Fashion",
	off:"45",
	link:"/cloths/shirts"
},
{
	img:"https://images-eu.ssl-images-amazon.com/images/I/91FX0tRh1tL._AC_UL320_SR240,320_.jpg",
	name:"Women's Fashion",
	off:"60",
	link:"/cloths/lahnga"
}					 
	];

// index_menFashon



var product_section=[{
	img:"https://images-eu.ssl-images-amazon.com/images/G/31/img20/GW-BasicsForMenWomen/5_1X._SY116_CB430251832_.jpg",
	name:"Comfy tees"
},
{
	img:"https://images-eu.ssl-images-amazon.com/images/G/31/img20/GW-BasicsForMenWomen/6_1X._SY116_CB430251832_.jpg",
	name:"Loungewear"
},
{
	img:"https://images-eu.ssl-images-amazon.com/images/G/31/img20/GW-BasicsForMenWomen/7_1X._SY116_CB430251834_.jpg",
	name:"innerwear"
},
{
	img:"https://images-eu.ssl-images-amazon.com/images/G/31/img20/GW-BasicsForMenWomen/8_1X._SY116_CB430251835_.jpg",
	name:"Flip Flops"
}					 
];

// index_womenFashion

// women product arry

var product_section2=[{
	img:"https://m.media-amazon.com/images/G/31/img2020/fashion/WA_2020/JuneWRS/updatedSBC/kurta._CB429787229_.jpg",
	name:"Kurtas"
},
{
	img:"https://m.media-amazon.com/images/G/31/img2020/fashion/WA_2020/JuneWRS/updatedSBC/SBC-3_19._CB429787228_.jpg",
	name:"Salwar Suits"
},
{
	img:"https://m.media-amazon.com/images/G/31/img2020/fashion/WA_2020/JuneWRS/updatedSBC/SBC-3_27._CB429787228_.jpg",
	name:"Dupatta"
},
{
	img:"https://m.media-amazon.com/images/G/31/img2020/fashion/WA_2020/JuneWRS/updatedSBC/saree._CB429787229_.jpg",
	name:"Sarees"
}					 
];

// comments

var comment=
	[
		{
			text:"Good quality fabric is used",
			rating:4,
			auther:
			{
				name:"Abhishek Singh"
			}
		}
	];




function seedDB()
{

Men.remove({},function(err){
	if(err)
		{
			console.log(err);
		}
	else
		{
			product_array.forEach(function(product){
				Men.create(product,function(err,created_product) {
					if(err)
						{
							console.log(err);
						}
					else
					{    
						//console.log("I am from seed");
						//console.log(created_product);
					}
					
				});
			});
		}
	
});
	
	// calling wp
	 wp();
	
}
// women product

function wp()
{
  
	Women.remove({},function(err){
	if(err)
		{
			console.log(err);
		}
	else
		{
			product_array3.forEach(function(product){
				Women.create(product,function(err,created_product) {
					if(err)
						{
							console.log(err);
						}
					else
					{    
						//console.log("I am from seed ,from women");
						//console.log(created_product);
					}
					
				});
			});
		}
	
});
	// calling offer
	 offer()
	
}
// offer function

function offer()
{
	Offer.remove({},function(err){
	if(err)
		{
			console.log(err);
		}
	else
		{
			 product_array1.forEach(function(product){
				Offer.create(product,function(err,created_product) {
					if(err)
						{
							console.log(err);
						}
					else
					{    
						//console.log("I am from seed ,from offer");
						//console.log(created_product);
					}
					
				});
			});
		}
	
});
	// calling menFashion()
	index_menFashion();
	
}

// index_menFashion

function index_menFashion()
{
	Menfashion.remove({},function(err){
	if(err)
		{
			console.log(err);
		}
	else
		{
			  product_section.forEach(function(product){
				Menfashion.create(product,function(err,created_product) {
					if(err)
						{
							console.log(err);
						}
					else
					{    
						//console.log("I am from seed ,from Menfashion");
						//console.log(created_product);
					}
					
				});
			});
		}
	
});
	// calling index_womenFashion()	
    index_womenFashion();
}
// index_menFashion

function index_womenFashion()
{
	Womenfashion.remove({},function(err){
	if(err)
		{
			console.log(err);
		}
	else
		{
			  product_section2.forEach(function(product){
				Womenfashion.create(product,function(err,created_product) {
					if(err)
						{
							console.log(err);
						}
					else
					{    
						//console.log("I am from seed ,from  women fashion");
						//console.log(created_product);
					}
					
				});
			});
		}
	
});
	
}



module.exports=seedDB;