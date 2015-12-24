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
            connection.query("SELECT * FROM stafflogin WHERE loginname = ? AND password = ?",[username,password], function(err, rows){	
                if (err)
                    return done(err);
                if (!rows.length) {
				
                    return done(null, false);
                }
        
                return done(null, rows[0]);
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
