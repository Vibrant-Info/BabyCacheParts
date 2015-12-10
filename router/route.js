var mysql = require('mysql');

var dbconfig = require('../config/dbconfig.js');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);
module.exports=function(app,passport){

	app.get('/', function(req, res){
	  res.render('index', { title: 'Munire_Comply' });
	});

	app.get('/loggedin', function(req, res) {
	  res.send(req.isAuthenticated() ? req.user : '0');
	});

	// route to log in
	app.post('/login', passport.authenticate('local'), function(req, res) {
		//console.log(req.user);
	  res.send(req.user);
	});

	// route to log out
	app.post('/logout', function(req, res){
	  req.logOut();
	  res.send(200);
	});
	
	app.get('/productskn',function(req,res){
		
		connection.query("select skn from product",function(err,rows){
			if(err)
				return err;
			res.send(rows);
		});
	});
	
	app.post('/addstore',function(req,res){
		
		 var storevalues=req.body;
		 var codereuse="Store Code already Exist";
		 var namereuse="Store name already Exist";
		connection.query("select code from store where code="+storevalues.code,function(err,rows){
			if(rows.length>0){
				res.send(codereuse);
			}
			else {
				connection.query("select name from store where name='"+storevalues.name+"'",function(err,rows){
					if(rows.length>0){
				res.send(namereuse);
				}
				else{
					connection.query("insert into store set ?",storevalues,function(err,result){
					if(err){
						console.log("Error="+err);
						return err;
					}
					res.send(result);
					});
				}
				})
		 });
		 
		/* var insert=	connection.query("insert into store set ?",storevalues,function(err,result){
			if(err){
				console.log("Error="+err);
				return err;
			}
			res.send(result);
			});
			console.log("query="+insert.sql);  */
	})

}

var auth = function(req, res, next){
  if (!req.isAuthenticated()) 
  	res.send(401);
  else
  	next();
};