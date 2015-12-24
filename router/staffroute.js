module.exports=function(app,passport,connection){

	app.get('/storecodelist',function(req,res){
		connection.query("SELECT storeid,code FROM store",function(err,rows){
			if(err)
				return err;
			res.send(rows);
		});
	});
	app.post('/addStaff',function(req,res){
		var loginnnamecheck=connection.query("SELECT loginname FROM stafflogin where loginname='"+req.body.loginname+"'",function(err,rows){
			console.log(rows.length);
			if(err){
				return err;
			}
			else if(rows.length>0){
				console.log("aaaaaaa");
				res.send("0");
			}
			else{
				 var insert=connection.query("INSERT INTO `staff` (`initial`,`firstname`,`lastname`,`emailid`,`storeid`)VALUES('"+req.body.initial+"','"+req.body.firstname+"','"+req.body.lastname+"','"+req.body.emailid+"','"+req.body.storeid.storeid+"')",req.body,function(err,result){
				
					if(err){
						return err;
					}
					else
					{
						var insert2=connection.query("INSERT INTO `stafflogin`(`loginname`, `password`, `staffid`) VALUES('"+req.body.loginname+"','"+req.body.password+"',"+result.insertId+")",req.body,function(err,result){
							if(err){
								return err;
							}
							else
								res.send("1");
						});
					}
				
				}); 
			}

		});
	});
	
	//Modift Staff page functions
	
	app.get('/getStorecode',function(req,res){
		connection.query("SELECT a.storeid,b.code FROM staff a,store b where a.storeid=b.storeid",function(err,rows){
			if(err)
				return err;
			res.send(rows);
		});
	});
	app.post('/getStaffValues',function(req,res){
		
		var staffvalues=req.body;
		console.log(req.body);
		var WHERE = " 1 = 1";
		if(staffvalues.storeid != undefined)
		WHERE += " AND `storeid` = '" + staffvalues.storeid+"'";
		if(staffvalues.firstname != undefined)
		WHERE += " AND `firstname` LIKE '%" + staffvalues.firstname+"%'";
		if(staffvalues.initial != undefined)
		WHERE += " AND `initial` LIKE '%" + staffvalues.initial+"%'";
		if(staffvalues.emailid != undefined)
		WHERE += " AND `emailid` LIKE '%" + staffvalues.emailid+"%'";
		if(staffvalues.lastname != undefined)
		WHERE += " AND `lastname` LIKE '%" + staffvalues.lastname+"%'";
		if(staffvalues.enabled != undefined){
			if(staffvalues.enabled != 2)
			WHERE += " AND `enabled` = '"+ staffvalues.enabled+"'";
			else 
			WHERE += " AND `enabled` IN (1,0)";
		}
		
		var query=connection.query("SELECT * FROM staff WHERE "+WHERE,function(err,rows){
			
			if(err)
				return err;
			res.send(rows);
		});
	});
	
	
	app.post('/staffstatus',function(req,res){
		var up=	connection.query("update staff set enabled="+req.body.st+" where staffid="+req.body.id,function(err,result){
			console.log(up.sql);
			if(err)
				return err;
			else{
				var up2=connection.query("update stafflogin set enabled="+req.body.st+" where staffid="+req.body.id,function(err,result){
				console.log(up2.sql);
				if(err)
					return err;
				res.send(result);
				});
			}
		}); 
	});
	app.post('/editstaff',function(req,res){
		
		var up=	connection.query("SELECT s.staffid,s.firstname,s.lastname,s.initial,s.emailid,sl.loginname FROM staff s,stafflogin sl WHERE s.staffid=? and sl.staffid=?",[req.body.id,req.body.id],function(err,rows){
				
			console.log(up.sql);
			console.log(rows[0]);
			if(err)
				return err;
			res.send(rows[0]);
			
		});
	});
	app.post('/updateStaff',function(req,res){
		console.log(req.body);
		var staffvalues=req.body;
		var staff="";
		var stafflogin="";
		if(staffvalues.lastname != undefined)
			staff += " ,`lastname` = '" + staffvalues.lastname +"'";
		if(staffvalues.emailid != undefined)
			staff += " , `emailid` = '" + staffvalues.emailid+"'";
		if(staffvalues.initial != undefined)
			staff += " , `initial` = '" + staffvalues.initial+"'";
		if(staffvalues.password != undefined)
			stafflogin += " , `password` = '" + staffvalues.password+"'";
		
		connection.query("UPDATE staff SET firstname = '" + staffvalues.firstname + "',lastmodified=NOW()" + staff + " WHERE staffid = " + staffvalues.staffid , function(err,result){
			
			if(err){
				return err;
			}
			connection.query("UPDATE stafflogin SET loginname = '" + staffvalues.loginname + "',lastmodified=NOW()" + stafflogin + " WHERE staffid = " + staffvalues.staffid , function(err,result){
							
				if(err){
					return err;
				}
				res.send(result);
			});
			
		})
		
		
		
		
	});
}