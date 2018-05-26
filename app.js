//dependencies
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const { matchedData, sanitize } = require('express-validator/filter');
const port = 3000;
var mongoose = require('mongoose');
//mongoose.connect("mongodb://"+process.env.dbUsername+":"+process.env.dbPassword+"@ds135760.mlab.com:35760/resubuild",function(err) {
mongoose.connect(process.env.MONGODB_URI,function(err) {
    if (err)
        errorDB = true;
});
var db = mongoose.connection;

//Routes for express
var routes = require("./routes/landingPage");
//var users = require("./routes/users");

//Initialize application
app = express();

//template engine
app.engine("handlebars", exphbs({defaultLayout: "layout"}));
app.set('port', (process.env.PORT || 5000))
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

//body parser for HTTP POST requests and cookies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//static pages
app.use(express.static(path.join(__dirname, "public")));

//session middleware
app.use(session({
  secret: "resuSecretWhyNot",
  saveUninitialized: true,
  resave: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//flash middleware
app.use(flash());

//global variables for flash
app.use(function(req, res, next){
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error"); //for passport
  res.locals.user = req.user || null;
  res.locals.isError = 1;
  next();
});

//set routes
app.use('/', routes);
//app.use('/users', users);

//listen
app.listen(app.get('port'), function(){
  console.log("server has started on port " + this.address().port);
});
