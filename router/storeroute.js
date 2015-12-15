
module.exports=function(app,passport,connection){
	//Adding Store Details
	app.post('/addstore',function(req,res){
		
		 var storevalues=req.body;
		 var codereuse="0";
		 var namereuse="1";
		 var Success="2"
		connection.query("SELECT code FROM store WHERE code="+storevalues.code,function(err,rows){
			if(rows.length>0){
				res.send(codereuse);
			}
			else {
				var select1=connection.query("SELECT name FROM store WHERE name='"+storevalues.name+"'",function(err,rows){
					if(rows.length>0){
						res.send(namereuse);
					}
					else{
						connection.query("INSERT INTO store set ?",storevalues,function(err,result){
						if(err){
							return err;
						}
						res.send(Success);
						});
					}
				});
			}
		 });

		
	});
	//Get Store list
	  app.get('/storelist',function(req,res){
		connection.query("SELECT code FROM store",function(err,rows){
			res.send(rows);
			});
		}); 
		app.post('/storestatus',function(req,res){
			
			var up=	connection.query("UPDATE store SET enabled="+req.body.st+" where code="+req.body.id,function(err,result){
				res.send(result);
			}); 
		});
	
	  app.post('/getStoreValues',function(req,res){

		var storevalues=req.body;
			var WHERE = " 1 = 1";
			if(storevalues.code != undefined)
				WHERE += " AND `code` = '" + storevalues.code+"'";
			if(storevalues.phone != undefined)
				WHERE += " AND `phone` = '" + storevalues.phone+"'";		
			if(storevalues.fax != undefined)
				WHERE += " AND `fax` = '" + storevalues.fax+"'";	
			if(storevalues.zipcode != undefined)
				WHERE += " AND `zipcode` = '" + storevalues.zipcode+"'";
			if(storevalues.address != undefined)
				WHERE += " AND `address` LIKE '%" + storevalues.address+"%'";
			if(storevalues.city != undefined)
				WHERE += " AND `city` LIKE '%" + storevalues.city+"%'";
			if(storevalues.country != undefined)
				WHERE += " AND `country` LIKE '%" + storevalues.country+"%'";
			if(storevalues.state != undefined)
				WHERE += " AND `state` LIKE '%" + storevalues.state+"%'";
			
			if(storevalues.enabled != undefined){
				if(storevalues.enabled != 2)
				WHERE += " AND `enabled` = '"+ storevalues.enabled+"'";
				else 
				WHERE += " AND `enabled` IN (1,0)";
			}
			var query=connection.query("SELECT * FROM store WHERE "+WHERE,function(err,rows){
			if(err)
				return err;
			res.send(rows);
		});
	  });

}