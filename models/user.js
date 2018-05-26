var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var ObjectId = require('mongodb').ObjectID;
const saltRounds = 10;

//user schema
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
  projects: {
    name: {
      type: String
    },
    technologies: {
      type: String
    },
    description: {
      type: String
    }
  },
  education: {
    name: {
      type: String
    },
    degree: {
      type: String
    }
  },
  achievements: {
    title: {
      type: String
    },
    description: {
      type: String
    }
  },
  workExperience: {
    jobTitle : {
      type: String
    },
    technologies: {
      type: String
    },
    accomplishments: {
      type: String
    }
  },
  other: {
    title: {
      type: String
    },
    description: {
      type: String
    }
  }

  });

var User = mongoose.model("users", UserSchema);
module.exports = User;

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

module.exports.getUserbyUsername = function(username, callback){
  var query = {'email': username};
  User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.updateUserSkills = function(idr, skill){
  User.findById(idr, function(err, user){
    if(err) console.log(err);
    user.skills.push(skill);
    user.save(function(err, user){
      if(err) console.log(err);
    });
  });
}

module.exports.updateUserProjects = function(idr, name, tech, desc){
  User.findById(idr, function(err, user){
    if(err) console.log(err);
    user.projects.name = name;
    user.projects.technologies = tech;
    user.projects.description = desc;
    user.save(function(err, user){
      if(err) console.log(err);
    });
  });
}

module.exports.updateEducation = function(idr, name, degree){
  User.findById(idr, function(err, user){
    if(err) console.log(err);
    user.education.name = name;
    user.education.degree = degree;
    user.save(function(err, user){
      if(err) console.log(err);
    });
  });
}

module.exports.updateAchievements = function(idr, name, desc){
  User.findById(idr, function(err, user){
    if(err) console.log(err);
    user.achievements.title = name;
    user.achievements.description = desc;
    user.save(function(err, user){
      if(err) console.log(err);
    });
  });
}

module.exports.updateWorkExperience = function(idr, jobtitle, tech, acc){
  User.findById(idr, function(err, user){
    if(err) console.log(err);
    user.workExperience.jobTitle = jobtitle;
    user.workExperience.technologies = tech;
    user.workExperience.accomplishments = acc;
    user.save(function(err, user){
      if(err) console.log(err);
    });
  });
}

module.exports.updateOther = function(idr, name, description){
  User.findById(idr, function(err, user){
    if(err) console.log(err);
    user.other.title = name;
    user.other.description = description;
    user.save(function(err, user){
      if(err) console.log(err);
    });
  });

}

module.exports.comparePassword = function(typed, hash, callback){
  bcrypt.compare(typed, hash, function(err, res) {
    if(err) throw err;
    callback(null, res);
});

}
