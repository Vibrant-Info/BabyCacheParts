var mysql = require('mysql');

var dbconfig = require('../config/dbconfig.js');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);
module.exports=function(app,passport){
	app.get('/getPblm',function(req,res){
		res.send("hjfgduijgb");
	});
	
}