module.exports=function(app,passport,connection){

app.get('/storecodelist',function(req,res){

	connection.query("SELECT storeid,code FROM store",function(err,rows){
			if(err)
				return err;
			res.send(rows);
		});
});
app.post('/addStaff',function(req,res){

	var insert=connection.query("INSERT INTO staff ('initial','firstname','lastname','emailid','storeid')VALUES('"+req.body.initial+"','"+req.body.firstname+"','"+req.body.lastname+"','"+req.body.emailid+"','"+req.body.storeid+"')",req.body,function(err,rows){
		console.log(insert.sql);
			if(err){
				console.log(err);
				return err;
			}
			res.send(rows);
		});
});

}