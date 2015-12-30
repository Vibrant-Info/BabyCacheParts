
module.exports=function(app,passport,connection,async,forEach){
	
	app.get('/getCodes',function(req,res){
		connection.query("SELECT `code` FROM `productpart` WHERE `enabled` = '1'",function(err,rows){
			if(err)
				return err;
			res.send(rows);
		});
	});
	app.get('/getProductCodes',function(req,res){
		connection.query("SELECT `skn`,`code` FROM `product` WHERE `enabled` = '1'",function(err,rows){
			if(err)
				return err;
			res.send(rows);
		});
	});
	
	app.get('/getshippingTypes',function(req,res){
		connection.query("SELECT `shippingtypeid`,`name` FROM `shippingtype` WHERE `enabled` = '1'",function(err,rows){
			if(err)
				return err;
			res.send(rows);
		});
	});
	app.put('/chgepartSts',function(req,res){		
	
		var q=connection.query("UPDATE `productpart` SET  `enabled` ="+req.body.val+" WHERE `productpartid` = "+req.body.id+"",function(err,result){	
			console.log(q.sql);
			if(err)
				return err;	
			res.send(result);
		});
	});
	
	//search by parts
	
	app.post('/searchPart',function(req,res){	
	
		var partvalues=req.body;
		
		
			var WHERE = " 1 = 1";
			
			if(partvalues.code != undefined)
				WHERE += " AND p.code = '" + partvalues.code.code+"'";
			if(partvalues.name != undefined)
				WHERE += " AND p.name LIKE '%" + partvalues.name+"%'";
			if(partvalues.desc != undefined)
				WHERE += " AND p.description LIKE '%" + partvalues.desc+"%'";
			
			if(partvalues.check != undefined){
				if(partvalues.check != 2)
				WHERE += " AND p.enabled = '"+ partvalues.check+"'";
				else 
				WHERE += " AND p.enabled IN (1,0)";
			}
					
			
			 if(partvalues.shipType!= undefined){
				WHERE += " AND s.shippingtypeid = '" +partvalues.shipType.shippingtypeid+"'  AND p.shippingtypeid = '" + partvalues.shipType.shippingtypeid+"'";	
				
					var query=connection.query("SELECT p.productpartid, p.code, p.description, p.enabled, p.name as 'partname', s.name,s.shippingtypeid FROM productpart p , shippingtype s where "+WHERE,function(err,rows){
					console.log(query.sql);
					if(err)
						return err;
					res.send(rows);
						
				});
				
			}
		
			if(partvalues.shipType==undefined){
				
				var q=connection.query("SELECT p.shippingtypeid as 'shippingtypeid' FROM productpart p where "+WHERE,function(err,rows){
				
				if(err)
					return err;
					var shippingtypeid=rows[0].shippingtypeid;
					WHERE += " AND s.shippingtypeid = '" +shippingtypeid+"'  AND p.shippingtypeid = '" + shippingtypeid+"'";	
					
					var query=connection.query("SELECT p.productpartid, p.code, p.description, p.enabled, p.name as 'partname', s.name,s.shippingtypeid FROM productpart p , shippingtype s where "+WHERE,function(err,rows){
					
					if(err)
						return err;
					res.send(rows);
						
					});
			
				});
				
			}
				
		});
	
	//search by product
		
		
	app.post('/searchbyproduct',function(req,res){	

		var productvalues=req.body;
		console.log(req.body);
		var ppvalues=[];
		var temp =[];
		var results=[];
		var productid='';
	
		 var WHERE = " 1 = 1";
		
		if(productvalues.skn != undefined)
			WHERE += " AND p.skn = '" + productvalues.skn.skn+"'";
		if(productvalues.prcode != undefined)
			WHERE += " AND p.code = '" + productvalues.prcode.code+"'";
		if(productvalues.prname != undefined)
			WHERE += " AND p.name LIKE '%" + productvalues.prname+"%'";
	
	async.series([
				function(callback) {
						//console.log("2222222222222");
					connection.query("SELECT p.productid as 'productid' FROM product p where "+WHERE,function(err,rows){
						if (err) {
							callback(err);
							return; //It's important to return so that the task callback isn't called twice
						}
						console.log(rows.length);
						if(rows.length==0){
							res.send("0");
							return;
						}
						productid=rows[0].productid;
						callback();
					});
					
				},
				function(callback) {
				//	console.log("33333333");
					connection.query("SELECT productpartid, productid FROM productandparts  where productid="+productid,function(err,result){
						if (err) {
							callback(err);
							return; //It's important to return so that the task callback isn't called twice
						}
						//console.log(result.length);
						if(result.length==0){
							res.send("0");
							return;
						}
						results=result;
						callback();
					});
					
				},
				function(callback) {
					var ids=[];
					for(var i=0;i<results.length;i++){
						ids[i]=results[i].productpartid;
					};
					
							idDone(ids)
			  	},
			
			], function(err) {
				if (err) {
					throw err; //Or pass it on to an outer callback, log it or whatever suits your needs
				}
				//console.log("sd"+result);
			});
			function idDone(ids){
				console.log(ids);
				var i=1;
					async.each(ids, function(id, callback) { //The second argument (callback) is the "task callback" for a specific messageId
						var a=connection.query("SELECT productpartid,shippingtypeid FROM productpart WHERE productpartid="+id,function(err,shippingrows){
							
							if (err) {
								callback(err);
								return; //It's important to return so that the task callback isn't called twice
							}
							if(shippingrows.length==0){
								res.send("0");
								return;
							}
							temp.push(shippingrows);
							i++;
							if(i>ids.length)	{
							
								alldone(temp);
							}
						});
							
					})
				
			}
			
						 
			 function alldone(temp) {
				 var j=1;
				//	console.log("ssssssssssssssssssss");
				for(var i=0;i<temp.length;i++){
					connection.query("SELECT p.productpartid, p.code, p.description, p.enabled, p.name as 'partname', s.name as 'name',s.shippingtypeid FROM productpart p, shippingtype s WHERE p.productpartid ="+temp[i][0].productpartid+" and s.shippingtypeid="+temp[i][0].shippingtypeid,function(err,rows){
						
					if(err){
						console.log("Error="+err);
						return err;
					}
					if(rows.length==0){
						res.send("0");
						return;
					}
					ppvalues.push(rows);
					
					j++;
					if(j>temp.length){
						console.log(ppvalues);
						res.send(ppvalues);
					}
				
					});  
				}
						
			}
				
	}); 
	
		//get part values for edit
		
	app.post('/editPart',function(req,res){
	
		var up=	connection.query("SELECT p.productpartid, p.code, p.description, p.enabled, p.name as 'partname', s.name as 'shiptypename',s.shippingtypeid FROM productpart p , shippingtype s WHERE p.productpartid=? AND p.shippingtypeid=? AND s.shippingtypeid=?",[req.body.pid,req.body.sid,req.body.sid],function(err,rows){
			
			if(err)
				return err;
			res.send(rows[0]);
			
		});
	});
	app.post('/updatePart',function(req,res){
		
		var partvalues=req.body;
		var part="";
		
		if(partvalues.description != undefined)
			part += " , `description` = '" + partvalues.description+"'";
		if(partvalues.partname != undefined)
			part += " , `name` = '" + partvalues.partname+"'";
		connection.query("SELECT code FROM productpart WHERE code='" + partvalues.code + "'",function(err,rows){
			if(err){
				return err;
			}
			else{
				if(rows.length>0){
					res.send("0");
				}
				else{
					connection.query("UPDATE productpart SET code = '" + partvalues.code + "',lastmodified=NOW()" + part + " WHERE productpartid = " + partvalues.productpartid , function(err,result){
						if(err){
							return err;
						}
						res.send(result);
					})
				}
			}
		});
		
	
	});
}