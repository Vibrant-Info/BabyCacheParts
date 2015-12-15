
module.exports=function(app,passport,connection){
	app.get('/getCodes',function(req,res){
		connection.query("SELECT `code` FROM `productpart` WHERE `enabled` = '1'",function(err,rows){
			if(err)
				return err;
			res.send(rows);
		});
	});
	app.get('/getshippingTypes',function(req,res){
		connection.query("SELECT `name` FROM `shippingtype` WHERE `enabled` = '1'",function(err,rows){
			if(err)
				return err;
			res.send(rows);
		});
	});
	app.post('/chgeSts',function(req,res){		
		connection.query("UPDATE `problemtype` SET  `enabled` ="+req.body.val+" WHERE `problemtypeid` = "+req.body.id+"",function(err,result){	
			//console.log(result.affectedRows);
			if(err)
				return err;	
			res.send(result);
		});
	});
	
}