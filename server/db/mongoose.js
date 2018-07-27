var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// Setting app to use standard promises, rather than a 3rd party library

mongoose.connect('mongodb://localhost:3000/TodoApp');
// Connect to database through mongoose

module.exports = {
  mongoose: mongoose
};
