module.exports=function(app,passport,connection){
	var date = new Date();
	app.post('/addPart',function(req,res){
		console.log(req.body);
		connection.query("INSERT INTO `productpart` (`archived`,`code`,`description`,`enabled`,`name`,`shippingtypeid`) VALUES ('false','"+req.body.code+"','"+req.body.name+"','1','"+req.body.name+"', '3')",function(err,result){			
			if(err)
				return err;
			res.send(result); 
		});
	});
	app.post('/searchClassification',function(req,res){
		var WHERE = " 1 = 1";
		if(req.body.types != undefined)
			WHERE += " AND `classificationid` = '" + req.body.types+"'";
		if(req.body.name != undefined)
			WHERE += " AND `name` LIKE '%" + req.body.name+"%'";
		if(req.body.check != undefined){
			if(req.body.check != 2)
				WHERE += " AND `enabled` = '"+ req.body.check+"'";
			else 
				WHERE += " AND `enabled` IN (1,0)";
		}
		connection.query("SELECT * FROM `classificationtype` WHERE"+ WHERE+ "",function(err,rows){		
			
			if(err)
				return err;	
			res.send(rows);
		}); 
	});
	app.put('/chgeSts',function(req,res){	
		 connection.query("UPDATE `classificationtype` SET  `enabled` ="+req.body.val+" WHERE `classificationtypeid` = "+req.body.id+"",function(err,result){
			if(err)
				return err;	
			res.send(result);
		}); 
	});
	
}