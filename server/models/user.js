var mongoose = require('mongoose');
// Get the mongoose library, not the mongoose js file we created.

// User model
var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
  }
});

// Make it exportable for other files
module.exports = {
  User: User
};
