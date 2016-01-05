var express = require('express');
var app = express();
var jade = require('jade');
mongoose = require('mongoose');
var  MongooseStore = require('connect-mongoose')(express);
var passport = require('passport');
var OAuthStrategy = require('passport-oauth').OAuthStrategy;
var LocalStrategy = require('passport-local').Strategy;
app.set('views', 'views');
app.set('view engine', 'jade');
consumerKey  = 'ERhL8EHCzDoHSLIdQBbgaA';
consumerSecret = 'KWvWncdQG6wapZFezTcHUWsx8mx8BZoOPEAYjknOiVO';

db = mongoose.createConnection('localhost', 'euro2012'); 
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function()
	{console.log('connected to database');
	app.use(function(req, res, next)
	{console.log(req.url +' at ' + Date.now());
	next();
	});

app.use(express.cookieParser());
app.use(function(req,res,next) {console.log('before using express.session');next();});
app.use(express.session(
	{ secret: 'KWvWncdQG6wapZFezTcHUWsx8mx8BZoOPEAYjknOiVO'
//	store: new MongooseStore({url: 'mongodb://root:@localhost:27017/3xam9l3'})
	}));
app.use(function(req,res,next) {console.log('session variables are'+JSON.stringify(req.session));next();});
app.use(passport.initialize()); 
app.use(passport.session());

passport.use(new LocalStrategy(function(username, password, done)
	{User.findOne({ username: username }, function (err, user)
		{if (err) 
			 return done(err); 
		      if (!user) 
			return done(null, false, { message: 'Incorrect username.' });
		      if (!user.validPassword(password)) 
			return done(null, false, { message: 'Incorrect password.' });
		      return done(null, user);
		    });
	  }
));

passport.use('provider', new OAuthStrategy(
	{requestTokenURL: 'https://chpp.hattrick.org/oauth/request_token.ashx',
	accessTokenURL: 'https://chpp.hattrick.org/oauth/access_token.ashx',
	userAuthorizationURL: 'https://chpp.hattrick.org/oauth/authorize.aspx',
	consumerKey: consumerKey,
	consumerSecret: consumerSecret,
	callbackURL: 'callback',
	}, function( token, tokenSecret, profile, done)
		{console.log('recieved function on line 33\n%s, %s, %s', token, tokenSecret, profile);
		req.session.oauth_token = token;
		req.session.oauth_token_secret = tokenSecret;
		}
	));


//app.get('/auth/provider', passport.authenticate('provider'));
app.get('/auth/provider', passport.authenticate('provider', { successRedirect: '/success.html', failureRedirect: '/fail.html' }));
//app.get('/auth/callback', passport.authenticate('provider', ));
app.get('/auth/callback', function(req, res, next) {console.log('calling back\n'+ req.session); passport.authenticate('provider');next();});

app.get('/success.html', function(req, res)
	{res.end('<title>success</title>success');});
app.get('/fail.html', function(req, res)
	{res.end('<title>fail</title>fail');});

//app.post('/login', function(req, res) {res.write('recieved this post on about line 80'); passport.authenticate('local', { successRedirect: '/success.html', failureRedirect: '/fail.html'});});

app.all('*', function(req, res)
	{console.log('landed on default page'); 
var s = 'Welcome to '+req.url;
	res.write('test'); //'<title>'+s+'</title>'+s);
	res.end('default page');
	});

server = app.listen(80, 'localhost', function () 
	{var host = server.address().address;
	var port = server.address().port;
	console.log('Example app listening at http://%s:%s', host, port);
	});

	});
