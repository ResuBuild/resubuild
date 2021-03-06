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
router.get('/gettingStarted', ensureAuthenticated, function(req,res){
  res.render("gettingStarted");
});

router.get('/addJob', ensureAuthenticated, function(req,res){
  res.render("addJob");
});

router.get('/buildResume', ensureAuthenticated, function(req,res){
  res.render("buildResume", {
    currentUser : res.locals.user
  });
});

router.get('/profile', ensureAuthenticated, function(req,res){
  res.render("profile", {
    currentUser : res.locals.user,
    firstname : res.locals.user.firstname + res.locals.user.lastname
  });
});

router.get('/achievements', ensureAuthenticated, function(req,res){
  res.render("achievements");
});

router.get('/education', ensureAuthenticated, function(req,res){
  res.render("education");
});

router.get('/experiences', ensureAuthenticated, function(req,res){
  res.render("experiences");
});

router.get('/projects', ensureAuthenticated, function(req,res){
  res.render("projects");
});

router.get('/other', ensureAuthenticated, function(req,res){
  res.render("other");
});

router.get('/skills', ensureAuthenticated, function(req,res){
  res.render("skills");
});

router.get('/', function(req, res){
  res.render("login");
});

router.get('/register', function(req, res){
  res.render("register");
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/')
})

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

//****************************************************************************
//                          POST METHODS
//****************************************************************************

router.post('/skills', function(req,res){
  User.updateUserSkills(res.locals.user.id, req.body.name);
    req.flash("success_msg", "Skill Added");
  res.redirect('/skills');
});

router.post('/projects', function(req, res){
  User.updateUserProjects(res.locals.user.id, req.body.name, req.body.tech,req.body.description);
    req.flash("success_msg", "Project Added");
  res.redirect('/projects');
});

router.post('/education', function(req, res){
  User.updateEducation(res.locals.user.id, req.body.name, req.body.degree);
  req.flash("success_msg", "Education Added");
res.redirect('/education');
});

router.post('/achievements', function(req, res){
  User.updateAchievements(res.locals.user.id, req.body.name, req.body.description);
  req.flash("success_msg", "Achievements Added");
  res.redirect('/achievements');
});

router.post('/experiences', function(req, res){
  User.updateWorkExperience(res.locals.user.id, req.body.name, req.body.tech, req.body.description);
  req.flash("success_msg", "Achievements Added");
  res.redirect('/experiences');
});

router.post('/other', function(req, res){
  User.updateOther(res.locals.user.id, req.body.name, req.body.description);
  req.flash("success_msg", "Other Information Added");
  res.redirect('/other');
});


router.get('/buildResume/:index', function(req, res){
  var jobName = res.locals.user.addedJob[req.params.index].title;
  var jobSkills = res.locals.user.addedJob[req.params.index].skills;

  var projects = res.locals.user.projects;
  var skills = res.locals.user.skills;
  jobSkills +=' ' + res.locals.user.addedJob[req.params.index].summary;
  var matchingSkills = [];
  var matchingProjects = [];

  for(let i = 0; i < skills.length; i += 1){
    if(jobSkills.toUpperCase().includes(skills[i].toUpperCase())){
      matchingSkills.push(skills[i]);
    }
  }

  for(let i = 0; i < projects.length; i += 1){
    var languages = projects[i].technologies.replace(/ /g,"").split(",");
    for(let j = 0; j < languages.length; j++){
      if(jobSkills.toUpperCase().includes(languages[j].toUpperCase())){
        matchingProjects.push({
          name : projects[i].name,
          technologies : projects[i].technologies,
          description : projects[i].description
        });
      }
    }
  }

  res.locals.user.matchedProjects = matchingProjects;
  res.locals.user.matchedSkills = matchingSkills;

  res.render("resumeFinal", {
    currentUser : res.locals.user
  });
});



router.post('/register', [
  check('email', 'not a valid email ').isEmail(),
  check('password2').custom((value,{req, loc, path}) => {
      if (value !== req.body.password1) {
          throw new Error("Passwords don't match");
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
    User.findOne({'email': req.body.email}, function(err, user){
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

router.post('/addJob', function(req, res){
  User.updateAddedJobs(res.locals.user.id, req.body.name, req.body.summary, req.body.responsibility, req.body.skills);
  req.flash("success_msg", "Job Added");
  res.redirect('/addJob');
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
        else return done(null, user);
      });
    });
  }));

router.post('/', passport.authenticate('local', {failureRedirect: '/', failureFlash: true}),
  function(req, res) {
    req.flash('success', 'You are currently logged in.');
    res.redirect('/gettingStarted');
    });


function ensureAuthenticated(req, res, next) {
  if ( req.isAuthenticated() ) return next();
  res.redirect('/')
}



module.exports = router;
