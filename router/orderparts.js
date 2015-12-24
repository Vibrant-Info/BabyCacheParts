	
module.exports=function(app,passport,connection){
	app.get('/getProductskn',function(req,res){
		connection.query("SELECT `skn`,`code` FROM `product` WHERE `enabled` = '1'",function(err,rows){
			if(err)
				return err;
			res.send(rows);
		});
	});
	app.get('/getColor',function(req,res){
		connection.query("SELECT name as 'prcolor' FROM classificationtype WHERE classificationid=1 and enabled = 1",function(err,rows){
			if(err)
				return err;
			res.send(rows);
		});
	});
	app.get('/getstyle',function(req,res){
		connection.query("SELECT name as 'style' FROM classificationtype WHERE classificationid=2 and enabled = 1",function(err,rows){
			if(err)
				return err;
			res.send(rows);
		});
	});
	app.get('/getprtype',function(req,res){
		connection.query("SELECT name as 'prtype' FROM classificationtype WHERE classificationid=3 and enabled = 1",function(err,rows){
			if(err)
				return err;
			res.send(rows);
		});
	});
	app.get('/getProblemTypes',function(req,res){
		connection.query("SELECT problemtypeid,name as 'prblmname' FROM problemtype WHERE enabled = 1",function(err,rows){
			if(err)
				return err;
			res.send(rows);
		});
	});
	app.get('/getStore',function(req,res){
		console.log('/getStore');
		connection.query("SELECT `storeid`,`code` as storename FROM `store`",function(err,rows){
			if(err)
				return err;
			res.send(rows);
		});
	});
	
	app.post('/storeDetails',function(req,res){
		connection.query("SELECT `storeid`, `address`, `city`, `country`, `state`, `zipcode` FROM `store` where storeid='"+req.body.storeid+"'",function(err,rows){
			if(err)
				return err;
			res.send(rows);
		}); 
	});
	
	//search the values for order
	
	app.post('/searchOrderItem',function(req,res){
		var pr_item=req.body;
		
		var classificationids=[];
		var WHERE = " 1 = 1";
		
			if(pr_item.prskn != undefined){
				WHERE += " AND p.skn = '" + pr_item.prskn.skn+"'";
				var a1=connection.query("SELECT productid from  product WHERE skn='"+pr_item.prskn.skn+"'",function(err,rows){
					console.log(rows[0].productid);
					if(err)
						return err;
					else{
						var a2=connection.query("SELECT productid,productpartid from  productandparts WHERE productid="+rows[0].productid,function(err,rows2){
							if(err)
								return err;
								getproductparts(rows2);
						});
					}
			});
			}
			
			if(pr_item.prtypes != undefined){
				var a1=connection.query("SELECT classificationtypeid as 'pr_typeid' FROM classificationtype WHERE classificationid=3 and name='"+pr_item.prtypes.prtype+"'",function(err,rows){
					console.log(a1.sql);
				
				if(err)
						return err;
				else{
					classificationids.push(rows[0].pr_typeid);
					var a2=connection.query("SELECT classificationtypeid as 'pr_styleid' FROM classificationtype WHERE classificationid=2 and name='"+pr_item.prstyle.style+"'",function(err,rows2){
						console.log(a2.sql);
						if(err)
							return err;
						else{
							classificationids.push(rows2[0].pr_styleid);
								
							var a3=	connection.query("SELECT classificationtypeid as 'pr_colorid' FROM classificationtype WHERE classificationid=1 and name='"+pr_item.prcolors.prcolor+"'",function(err,rows3){
									
								if(err)
									return err;
								else{
									 classificationids.push(rows3[0].pr_colorid);
									var productids=[];
									var limit=0;
									for(var i=0;i<classificationids.length;i++){
										console.log(classificationids[i]);
										var a=connection.query("SELECT productid from productclassification WHERE classificationtypeid="+classificationids[i],function(err,rows4){
										
										if(err){
											console.log("Error="+err);
											return err;
										}
										else{	
												productids.push(rows4);
												limit++;
												console.log(limit+"-"+classificationids.length);
												if(limit==classificationids.length){
													getProduct(productids);
												}
											}
									
										});
									}
									
								}
						
							});
						}
				
					});
					}
				});
			}
		function getProduct(ids){
			
		
		var products=[];
	
		var productid1=[];
		var productid2=[];
		var productid3=[];
		var pp1=[];
		var pp2=[];
		var pp3=[];
		var pp4=[];
		var pp5=[];
		var a=0;
		var b=0;
		
		 for(var i=0;i<ids.length;i++){
			 if(i==0){
			  productid1.push(ids[i]);
			 } 
			 if(i==1){
				  productid2.push(ids[i]);
			 } if(i==2){
				  productid3.push(ids[i]);
			 }
		 }
			
		while(a<1){
			 if(productid1[0][b]=== undefined){
				break;
			 }
			 else
			 {
			
			 pp1.push((productid1[0][b].productid));
			  b++;
			 }
		}
			b=0;
		while(a<1){
			
			 if(productid2[0][b]===undefined){
				 break;
			 } 
			 else
			 {
				pp2.push(productid2[0][b].productid);
				b++;
			}
		}
		b=0;
		while(a<1){
			 
			 if(productid3[0][b]===undefined){
				 break;
			 }
			 else{
				 pp3.push(productid3[0][b].productid);
				b++;
			 }
		} 
		b=0;
	
		 for(var c=0;c<pp1.length;c++){
			for(var d=0;d<pp2.length;d++){
				if(pp1[c]==pp2[d]){
					pp4.push(pp1[c]);
				}
			}
		}
		
		if(pp4.length==0){
			res.send("0");
		}
		else{
			
			 for(var e=0;e<pp4.length;e++){
				for(var f=0;f<pp3.length;f++){
					if(pp4[e]==pp3[f]){
						pp5.push(pp3[f]);
					}
				}
					
			}
			var l=0;
		
			for(var pl=0; pl<pp5.length;pl++){
			
				var ab=connection.query("SELECT productid,productpartid from  productandparts WHERE productid="+pp5[pl],function(err,rows){
			
					if(err)
						return err;
					
					l++;
					console.log(l+"="+pp5.length);
					if(l==pp5.length){
						getproductparts(rows);
					}
				
				
				});
			}
		}
			
		

	}
	var partitems=[];
	function getproductparts(vals){
		console.log(vals);
		var j=0;
		
			for(var a=0;a<vals.length;a++){
						
				var ss=connection.query("select p.productid,p.description as 'productdesc', p.skn, pp.code as 'partcode',pp.productpartid,pp.description as 'partdesc' from product p, productpart pp where pp.productpartid='"+vals[a].productpartid+"' and p.productid="+vals[a].productid,function(err,row2){
					console.log(ss.sql);
									
					if(err)
						return err;
					else{
						partitems.push(row2);
						
						j++;
						if(j==vals.length){
							
							res.send(partitems);
						}
			
					}
				
				
				});
			}
	}
	
	});
	app.post('/postOrder',function(req,res){
		var shipdetails=req.body.address;
		var cartdetails=req.body.carts;
		var orderid;
	console.log(cartdetails);
	   
	    var productorder={shippingmode:shipdetails.store,staffid:shipdetails.staffid,storeid:shipdetails.storename[1].storeid};
		
		var a=connection.query("INSERT INTO `productorder` set ?",productorder,function(err,result1){
			console.log(a.sql);
			if(err){
				return err;
			}
			else{
				if(result1.affectedRows > 0 ){
					orderid=result1.insertId;
						var guestshippingdetails={address:shipdetails.address,city:shipdetails.city,country:shipdetails.country,emailid:shipdetails.emailid,fax:shipdetails.fax,guestfirstname:shipdetails.guestfirstname,guestlastname:shipdetails.guestlastname,phone:shipdetails.phone,repfirstname:shipdetails.fname,replastname:shipdetails.lname,state:shipdetails.state,zipcode:shipdetails.zipcode,approverid:shipdetails.staffid,orderid:orderid}
								var c=connection.query("INSERT INTO `guestshippingdetail` set ?",guestshippingdetails,function(err,result2){
									console.log(c.sql);
									if(err)
										return err;
									if(result2.affectedRows > 0 ){
										var d=0;
										for(var i=0;i<cartdetails.length;i++){
										
											var orderdetail={factorycode:cartdetails[i].factorycode,notes:cartdetails[i].add_info,ponumber:cartdetails[i].ponum,productiondate:cartdetails[i].productdate,purchasedon:cartdetails[i].purchasedate,quantity:cartdetails[i].quantity,shippedquantity:'0',orderid:orderid,problemtypeid:cartdetails[i].problemtypeid,productid:cartdetails[i].productid,productpartid:cartdetails[i].productpartid,shippingtypeid:'3'};
				
											var b=connection.query("INSERT INTO `orderdetail` set ?",orderdetail,function(err,result3){
												console.log(b.sql);
												if(err)
													return err;
												else{
													if(result2.affectedRows > 0 ){
														d++;
													
														if(d == cartdetails.length )
															res.send("1");
													}
													else{
														res.send("0");
													}
												}
											});
										}
									}
									else{
										res.send("0");
									}
									
								});
				
				}
				else{
					res.send("0");
				}
			}
				
		});
	}) ;
	
	
}
