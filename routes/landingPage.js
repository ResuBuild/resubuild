//***************************************************************************
//                            IMPORTS
//***************************************************************************
var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
var User = require("../models/user");
const { check, validationResult } = require('express-validator/check');
//var config = require("../auth");

//****************************************************************************
//                            GET METHODS
//****************************************************************************
router.get('/', function(req, res){
  res.render("login");


});

router.get('/register', function(req, res){
  res.render("register");
});

//****************************************************************************
//                          POST METHODS
//****************************************************************************
router.post('/register', [
  check('email', 'not a valid email ').isEmail(),
  check('password2').custom((value,{req, loc, path}) => {
            if (value !== req.body.password1) {
                throw new Error(" Passwords don't match");
            } else {
                return value;
            }
        })
],function(req, res){
  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    return `${msg}`;
  };
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    res.locals.isError = null;
    res.render('register', {
      error: errors.array()
    });
  }
else{
  process.nextTick(function(){
    User.findOne({'local.email': req.body.email}, function(err, user){
      if(user){
        res.render("register", {
          error: "Email already used"
        });
      }else{
        //********************************************************************
        //                         UPDATE USER
        //********************************************************************
        var firstname = req.body.first;
        var lastname = req.body.last;
        var email = req.body.email;
        var password = req.body.password1;
        var newUser = new User();
        newUser.firstname = firstname;
        newUser.lastname = lastname;
        newUser.email = email;
        newUser.password = password;
        User.createUser(newUser, function(err, user){
          if(err){
            console.log(err);
            throw err;
          }
        });
        req.flash("success_msg", "You are now registered!");
        res.redirect('/');
}
});
});
}
});

//PASSPORT middleware
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserbyUsername(username, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null, false, {message: "Unknown Email Used"});
      }
      User.comparePassword(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(!isMatch) return done(null, false, {message: "Invalid Password"});
      });
    });
  }));

router.post('/', passport.authenticate('local', {failureRedirect: '/', failureFlash: true}),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    console.log("done");
    //res.redirect('/profile');
    });






module.exports = router;
