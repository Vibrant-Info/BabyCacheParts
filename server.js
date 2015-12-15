var express = require('express');
var http = require('http');
var path = require('path');
var passport = require('passport');
var bodyParser=require('body-parser');

// Start express application
var app = express();
var mysql = require('mysql');
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views',path.resolve(__dirname,'public','views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser()); 
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'securedsession' }));
app.use(passport.initialize()); // Add passport initialization
app.use(passport.session());    // Add passport initialization
app.use(app.router);


// development only	

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


var dbconfig = require('./config/dbconfig');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

require('./config/passport')(passport);


require('./router/route')(app,passport);
require('./router/problemType')(app,passport,connection);


require('./router/route')(app,passport,connection);
require('./router/storeroute')(app,passport,connection);
require('./router/staffroute')(app,passport,connection);

require('./router/classificationList')(app,passport,connection);
require('./router/addProduct')(app,passport,connection);


 http.createServer(app).listen(app.get('port'), function(){
  console.log('listening on port ' + app.get('port'));
 
}); 
