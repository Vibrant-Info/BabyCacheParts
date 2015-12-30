module.exports=function(app,passport,connection,async,_,forEach){
	app.get('/getskns',function(req,res){
		connection.query("SELECT `skn`,`code`,`productid` FROM `product`",function(err,rows){
			if(err)
				return err;
			res.send(rows);
		});
	});
	
	app.post('/searchOrders',function(req,res){
		var orderitems=req.body.orders;
		
		var productorders=[];
		var productordersitems=[];
	
		var guestdetails ='"1==1"';
		if(orderitems.guestlastname!=undefined){
			guestdetails+=" AND gsd.guestlastname LIKE '%"+orderitems.guestlastname+"%'";
		}
		if(orderitems.replastname!=undefined){
			guestdetails+=" AND gsd.replastname LIKE '%"+orderitems.replastname+"%'";
		}
		if(orderitems.sku!=undefined){
			guestdetails+=" AND od.productid ="+orderitems.sku.productid+"";
		}
		
		if(orderitems.orstatus == 3 || orderitems.orstatus == undefined){
			var conditions =" status IN (0,1,2)";
		}
		else{
			var conditions =" status='"+orderitems.orstatus+"'";
		}
		
		if(orderitems.startdate!= undefined && orderitems.enddate!= undefined ){
			conditions +=" AND createdon BETWEEN '"+orderitems.startdate+"' AND '"+orderitems.enddate+"'";
		}
		if(orderitems.staffid!='1'){
			conditions+=" AND staffid='"+orderitems.staffid+"'";
			guestdetails+=" AND approverid='"+orderitems.staffid+"'";
		}		
			
		if(orderitems.ornumber!=undefined){
			var b=connection.query("SELECT `orderid` FROM productorder WHERE orderid='"+orderitems.ornumber+"' AND "+conditions,function(err,rows){
			
			if(err)
				return err;
			else{
				
				if(rows.length>0){
				
					var a=connection.query("SELECT po.orderid as 'orderid',po.status as 'status',po.createdon as 'createddate',po.shippingmode as 'shippingdetail',od.quantity as 'quantity',gsd.*,pp.code,pp.name as 'partname',p.skn,st.name as 'shipname',pt.name as 'problemname',sto.address as 'storeaddress',sto.city as 'storecity',sto.country as 'storecountry',sto.state as 'storestate',sto.zipcode as 'storezipcode',sto.phone as 'storephone' From productorder  po,orderdetail od,guestshippingdetail gsd,productpart pp,product p,shippingtype st,store sto,problemtype pt WHERE po.orderid='"+orderitems.ornumber+"' AND od.orderid='"+orderitems.ornumber+"' AND gsd.orderid='"+orderitems.ornumber+"' AND pp.productpartid=od.productpartid AND p.productid=od.productid AND st.shippingtypeid=od.shippingtypeid AND sto.storeid=po.storeid AND pt.problemtypeid=od.problemtypeid AND "+ guestdetails,function(err,rows2){
					
						if(err)
							return err;
						else{
							console.log(rows2.length);
							if(rows2.length>0){
								res.send(rows2);
							}
							else{
								res.send("0");
							}
						}
					});
				}
				else{
					res.send("0");
				}
			}
			});
					
		}
		var q1=connection.query("SELECT `orderid` FROM productorder WHERE "+conditions,function(err,rows){
		
			if(err)
				return err;
			else{
				if(rows.length>0){
					
					productorders=rows;
						var a=0;
					for(var i=0;i<productorders.length;i++){
						var q2=	connection.query("SELECT po.orderid as 'orderid',po.status as 'status',po.createdon as 'createddate',po.shippingmode as 'shippingdetail',od.quantity as 'quantity',gsd.*,pp.code,pp.name as 'partname',p.skn,st.name as 'shipname',pt.name as 'problemname',sto.address as 'storeaddress',sto.city as 'storecity',sto.country as 'storecountry',sto.state as 'storestate',sto.zipcode as 'storezipcode',sto.phone as 'storephone' From productorder  po,orderdetail od,guestshippingdetail gsd,productpart pp,product p,shippingtype st,store sto,problemtype pt WHERE po.orderid='"+productorders[i].orderid+"' AND od.orderid='"+productorders[i].orderid+"' AND gsd.orderid='"+productorders[i].orderid+"' AND pp.productpartid=od.productpartid AND p.productid=od.productid AND st.shippingtypeid=od.shippingtypeid AND sto.storeid=po.storeid AND pt.problemtypeid=od.problemtypeid AND "+ guestdetails,function(err,rows2){
				
						if(err)
							return err;
						else{
								if(rows2.length>0){
									productordersitems.push(rows2);
									a++;
									console.log(a+"="+productorders.length);
									if(a == productorders.length){
										res.send(productordersitems);
									}
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
			}
			
		});
	
	});
	app.post('/orderCancel',function(req,res){
		connection.query("UPDATE productorder SET status='2' WHERE orderid="+req.body.orderid,function(err,results){
			if(err){
				return err;
			}
			else{
				if(results.affectedRows>0){
					res.send("1");
				}
			}
		});
	});
	app.post('/getorderComments',function(req,res){
		var a=connection.query("select oc.*,staf.firstname as 'fname',staf.lastname as 'lname' from ordercomment oc,staff staf where orderid="+req.body.orderid+" AND staf.staffid=oc.commentby",function(err,rows){
		
			if(err)
				return err;
			else{
				res.send(rows);
			}
		});
	});
	app.post('/getorderDetails',function(req,res){
		var oid=req.body.id;
		
		var a=connection.query("SELECT po.orderid as 'orderid',po.status as 'status',po.createdon as 'createddate',po.shippingmode as 'shippingdetail',od.quantity as 'quantity',od.orderdetailid,gsd.*,pp.code,pp.name as 'partname',p.skn,st.name as 'shipname',pt.name as 'problemname',sto.address as 'storeaddress',sto.city as 'storecity',sto.country as 'storecountry',sto.state as 'storestate',sto.zipcode as 'storezipcode',sto.phone as 'storephone' From productorder  po,orderdetail od,guestshippingdetail gsd,productpart pp,product p,shippingtype st,store sto,problemtype pt WHERE po.orderid='"+oid+"' AND od.orderid='"+oid+"' AND gsd.orderid='"+oid+"' AND pp.productpartid=od.productpartid AND p.productid=od.productid AND st.shippingtypeid=od.shippingtypeid AND sto.storeid=po.storeid AND pt.problemtypeid=od.problemtypeid ",function(err,rows2){
		
					
			if(err)
				return err;
			else{
			
				if(rows2.length>0){
					res.send(rows2);
				}
				else{
					res.send("0");
				}
			}
		});
	});
	app.post('/ordersave',function(req,res){
		
		var sql6=connection.query("UPDATE orderdetail SET shippedquantity='"+req.body.shipquan+"' WHERE orderdetailid="+req.body.orid,function(err,results1){
			console.log(sql6.sql);
			if(err)
					return err;
				res.send("1");
			});
	});
	app.post('/saveComment',function(req,res){
		var orderComments=req.body.oreditvalues;
		if(orderComments.orstatus!=undefined){
			
			var sql1=connection.query("UPDATE productorder SET status='"+orderComments.orstatus.upstatus+"' WHERE orderid="+orderComments.orderid,function(err,results1){
				console.log(sql1.sql);
				if(err)
					return err;
				else{
					if(results1.affectedRows>0){
						if(orderComments.orcomments === undefined ){
							res.send("1");
						}
					}
					else{
						res.send("0");
					}
				}
			});
		}
	
		if(orderComments.orcomments!=undefined){
			var insertcomment="INSERT INTO ordercomment set ?";
				var insertitems={comment:orderComments.orcomments,commentby:orderComments.staffid,orderid:orderComments.orderid};
				var c=connection.query(insertcomment,insertitems,function(err,result3){
				console.log(c.sql);
					if(err)
						return err;
					else{
						if(result3.affectedRows>0){
						
								res.send("1");
						
						}
						else{
							res.send("0");
							}
					}
				});
			}
				
	});
}