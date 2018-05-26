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
    type: [{firstName: String, lastName: String}]
  },
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

module.exports.updateUser = function(idr){
  User.findById(idr, function(err, user){
    if(err) console.log(err);
    user.confirmed = true;
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
