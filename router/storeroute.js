
module.exports=function(app,passport,connection){
	//Adding Store Details
	app.post('/addstore',function(req,res){
		
		 var storevalues=req.body;
		 var codereuse="0";
		 var namereuse="1";
		 var Success="2"
		connection.query("select code from store where code="+storevalues.code,function(err,rows){
			console.log("rows="+rows.length);
			if(rows.length>0){
				console.log("codereuse="+codereuse);
				res.send(codereuse);
			}
			else {
				var select1=connection.query("select name from store where name='"+storevalues.name+"'",function(err,rows){
				console.log(select1.sql);
				console.log("rows name="+rows);
				if(rows.length>0){
					console.log("namereuse="+namereuse);
					res.send(namereuse);
				}
				else{
					connection.query("insert into store set ?",storevalues,function(err,result){
					if(err){
						console.log("Error="+err);
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
		connection.query("select * from store",function(err,rows){
			res.send(rows);
			});
		});
		app.post('/storestatus',function(req,res){
			
		var up=	connection.query("update store set enabled="+req.body.st+" where code="+req.body.id,function(err,result){
				console.log(up.sql);
			res.send(result);
			}); 
		});
	

}