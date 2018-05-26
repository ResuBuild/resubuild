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
      type: [String]
    },
    technologies: {
      type: [String]
    },
    description: {
      type: [String]
    }
  },
  education: {
    name: {
      type: [String]
    },
    degree: {
      type: [String]
    }
  },
  achievements: {
    title: {
      type: [String]
    },
    description: {
      type: [String]
    }
  },
  workExperience: {
    jobTitle : {
      type: [String]
    },
    technologies: {
      type: [String]
    },
    accomplishments: {
      type: [String]
    }
  },
  other: {
    title: {
      type: [String]
    },
    description: {
      type: [String]
    }
  },
  addedJob : {
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
  }, 
  matchedSkills : {
    type: [String]
  }, 
  matchedProjects: {
    name: {
      type: [String]
    },
    technologies: {
      type: [String]
    },
    description: {
      type: [String]
    }
  },
  matchedExperience: {
    jobTitle : {
      type: [String]
    },
    technologies: {
      type: [String]
    },
    accomplishments: {
      type: [String]
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
    user.projects.name.push(name);
    user.projects.technologies.push(tech);
    user.projects.description.push(desc);
    user.save(function(err, user){
      if(err) console.log(err);
    });
  });
}

module.exports.updateEducation = function(idr, name, degree){
  User.findById(idr, function(err, user){
    if(err) console.log(err);
    user.education.name.push(name);
    user.education.degree.push(degree);
    user.save(function(err, user){
      if(err) console.log(err);
    });
  });
}

module.exports.updateAchievements = function(idr, name, desc){
  User.findById(idr, function(err, user){
    if(err) console.log(err);
    user.achievements.title.push(name);
    user.achievements.description.push(desc);
    user.save(function(err, user){
      if(err) console.log(err);
    });
  });
}

module.exports.updateWorkExperience = function(idr, jobtitle, tech, acc){
  User.findById(idr, function(err, user){
    if(err) console.log(err);
    user.workExperience.jobTitle.push(jobtitle);
    user.workExperience.technologies.push(tech);
    user.workExperience.accomplishments.push(acc);
    user.save(function(err, user){
      if(err) console.log(err);
    });
  });
}

module.exports.updateOther = function(idr, name, description){
  User.findById(idr, function(err, user){
    if(err) console.log(err);
    user.other.title.push(name);
    user.other.description.push(description);
    user.save(function(err, user){
      if(err) console.log(err);
    });
  });
}

module.exports.updateAddedJobs = function(idr, title, summary, responsibility, skills){
  User.findById(idr, function(err, user){
    if(err) console.log(err);
    user.addedJob.title.push(title);
    user.addedJob.summary.push(summary);
    user.addedJob.responsibility.push(responsibility);
    user.addedJob.skills.push(skills);
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
