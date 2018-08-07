var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// Setting app to use standard promises, rather than a 3rd party library

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');
// Connect to database through mongoose
// We check if a mongoDB exists, if not we use the local host

module.exports = {
  mongoose: mongoose
};
