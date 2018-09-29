const mongoose = require('mongoose');
// Get the mongoose library, not the mongoose js file we created.
const validator = require('validator');
// Used to validate the email address is in the correct format
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// Schema allows us to tack on custom methods
var UserSchema =  new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    unique: true,  // Verify an email is only used once in the db
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      },
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  // Tokens (array) is a mongodb feature that isn't available in SQL dbs like postgres
  // Access tokens for individual users
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});
// It stores the properties of a user

// Determines what is sent back when a user model is converted to a JSON value
UserSchema.methods.toJSON = function() {
var user = this;
var userObject = user.toObject();
// This method converts Mongoose var (user) to object where only the properties on the document exist
return _.pick(userObject, ['_id', 'email']);
// Use lodash to pick properties off the object- only picking id and email here
}

//Instance methods on a user
// NOT using an arrow function here, they do NOT bind a this keyword. This stores the individual doc
UserSchema.methods.generateAuthToken = function () {
  var user = this; // Making it clear what THIS is, THIS stores the individual document
  var access = 'auth';
  // First is object we want to sign, second is a secret value that we will have in a config var
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  // Update the local user model
  // Concat on a new object with those two properties- access and token
  user.tokens = user.tokens.concat([{access, token}]);

  // Save the user model
  return user.save().then(() => {
    return token;
  });
};

// User model
var User = mongoose.model('User', UserSchema);

// Make it exportable for other files
module.exports = {
  User: User
};
