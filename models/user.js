var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var ObjectId = require('mongodb').ObjectID;
const saltRounds = 10;

//User Schema
var UserSchema = mongoose.Schema({
  firstname: {
    type: String
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  lastname: {
    type: String
  },
  skills: {
    type: [String]
  },
  projects: []
  /*
    name: {
      type: [String]
    },
    technologies: {
      type: [String]
    },
    description: {
      type: [String]
    }
  */
  ,
  education: []
  /*
    name: {
      type: [String]
    },
    degree: {
      type: [String]
    }
  */
  ,
  achievements: []
  /*
    title: {
      type: [String]
    },
    description: {
      type: [String]
    }
  */
  ,
  workExperience: []
  /*
    jobTitle : {
      type: [String]
    },
    technologies: {
      type: [String]
    },
    accomplishments: {
      type: [String]
    }
  */
  ,
  other: []
  /*
    title: {
      type: [String]
    },
    description: {
      type: [String]
    }
  */
  ,
  addedJob : []
  /*
    title: {
      type: [String]

    },
    summary : {
      type: [String]

    },
    responsibility : {
      type: [String]

    },
    skills : {
      type: [String]

    }
  */
  , 
  matchedSkills : {
    type: [String]
  }, 
  matchedProjects: []
  /*
    name: {
      type: [String]
    },
    technologies: {
      type: [String]
    },
    description: {
      type: [String]
    }
  */
  });

var User = mongoose.model("users", UserSchema);
module.exports = User;

//Creates user and adds to data with a hashed password
module.exports.createUser = function(newUser, callback){
  bcrypt.genSalt(saltRounds, function(err, salt){
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.save(function(err, thing){
        if(err) console.log(err);
      });
    });
  });
}

//Checks if user is in database (by username)
module.exports.getUserbyUsername = function(username, callback){
  var query = {'email': username};
  User.findOne(query, callback);
}

//Check if user is in database (by objectID)
module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

//Add skill to user
module.exports.updateUserSkills = function(idr, skill){
  User.findById(idr, function(err, user){
    if(err) console.log(err);
    user.skills.push(skill);
    user.save(function(err, user){
      if(err) console.log(err);
    });
  });
}

//Add project to user
module.exports.updateUserProjects = function(idr, name, tech, desc){
  User.findById(idr, function(err, user){
    if(err) console.log(err);
    user.projects.push({
      name : name,
      technologies : tech,
      description : desc
    });
    user.save(function(err, user){
      if(err) console.log(err);
    });
  });
}

//Add education to user
module.exports.updateEducation = function(idr, name, degree){
  User.findById(idr, function(err, user){
    if(err) console.log(err);
    user.education.push({
      name : name,
      degree : degree
    });
    user.save(function(err, user){
      if(err) console.log(err);
    });
  });
}

//Add achievements to user
module.exports.updateAchievements = function(idr, name, desc){
  User.findById(idr, function(err, user){
    if(err) console.log(err);
    user.achievements.push({
      name : name,
      description : desc
    });
    user.save(function(err, user){
      if(err) console.log(err);
    });
  });
}

//Add work experience to user
module.exports.updateWorkExperience = function(idr, jobtitle, tech, acc){
  User.findById(idr, function(err, user){
    if(err) console.log(err);
    user.workExperience.push({
      jobTitle : jobtitle,
      technologies : tech,
      accomplishments : acc
    });
    user.save(function(err, user){
      if(err) console.log(err);
    });
  });
}

//Add other details to user
module.exports.updateOther = function(idr, name, desc){
  User.findById(idr, function(err, user){
    if(err) console.log(err);
    user.other.push({
      title : name,
      description : desc
    });
    user.save(function(err, user){
      if(err) console.log(err);
    });
  });
}

//Add desired job to database
module.exports.updateAddedJobs = function(idr, title, summary, responsibility, skills){
  User.findById(idr, function(err, user){
    if(err) console.log(err);
    user.addedJob.push({
      title : title,
      summary : summary,
      responsibility : responsibility,
      skills : skills
    });
    user.save(function(err, user){
      if(err) console.log(err);
    });
  });
}

//Login password check
module.exports.comparePassword = function(typed, hash, callback){
  bcrypt.compare(typed, hash, function(err, res) {
    if(err) throw err;
    callback(null, res);
});

}
