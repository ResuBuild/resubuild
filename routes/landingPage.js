//***************************************************************************
//                            IMPORTS
//***************************************************************************
var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
//var User = require("../models/user");
//var config = require("../auth");

//****************************************************************************
//                            GET METHODS
//****************************************************************************
router.get('/', function(req, res){
  res.render("login");
});

module.exports = router;
