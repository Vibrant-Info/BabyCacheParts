
module.exports=function(app,passport,connection){
	app.get('/getPblm',function(req,res){
		connection.query("SELECT * FROM `problemtype`",function(err,rows){
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