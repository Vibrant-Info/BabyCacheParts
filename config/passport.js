var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./dbconfig');
var connection = mysql.createConnection(dbconfig.connection);

var connectdb=connection.query('USE ' + dbconfig.database);
console.log("connectdb===================="+ dbconfig.database);
module.exports = function(passport) {

	passport.use(new LocalStrategy({
			usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
		
	var q=connection.query("SELECT enabled FROM stafflogin WHERE loginname = ? and password=?",[username,password],function(err,rows){
			console.log(q.sql);
			console.log(rows[0]);
			
			 if(rows[0]!=undefined){
				 console.log("aaaaaaaaa");
				if(rows[0].enabled==0){
				  return done(null, "0");
			 }else{
			
				var log=connection.query("SELECT * FROM stafflogin WHERE loginname = ? and password=?",[username,password], function(err, rows){
					
					if (err)
						return done(err);
					if (!rows.length) {
						console.log("rows.length="+rows.length);
						return done(null, false);
					}
			
					return done(null, rows[0]);
				});
			 
			 }
			 }
			 else{
				 return done(null, false);
			 }
			});
        })
	);

	// Serialized and deserialized methods when got from session
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(user, done) {
		done(null, user);
	});

}
//==================================================================
