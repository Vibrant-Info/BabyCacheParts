
module.exports=function(app,passport,connection){

	app.get('/', function(req, res){
		var nodemailer = require('nodemailer');
		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'donotreply@gmail.com',
				pass: ''
			}
		});
	var mailOptions = {
    from: 'vijaykamalr@gmail.com', // sender address
    to: 'vijay@vibrant-info.com', // list of receivers
    subject: 'Email Example', // Subject line
    text: "helooooooooooooooo" //, // plaintext body
   
};
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			console.log(error);
			res.json({yo: 'error'});
		}else{
			console.log('Message sent: ' + info.response);
			res.json({yo: info.response});
		};
	});
	  res.render('index', { title: 'Munire_Comply' });
	});

	app.get('/loggedin', function(req, res) {
	  res.send(req.isAuthenticated() ? "1" : '0');
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

}

var auth = function(req, res, next){
  if (!req.isAuthenticated()) 
  	res.send(401);
  else
  	next();
};