const mongoose = require('mongoose');
// Get the mongoose library, not the mongoose js file we created.
const validator = require('validator')
// Used to validate the email address is in the correct format

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

//Instance methods on a user
// NOT using an arrow function here, they do NOT bind a this keyword. This stores the individual doc
UserSchema.methods.generateAuthToken = function () {
  var user = this; // Making it clear what THIS is


  ////// left off Here

}

// User model
var User = mongoose.model('User', UserSchema);

// Make it exportable for other files
module.exports = {
  User: User
};
