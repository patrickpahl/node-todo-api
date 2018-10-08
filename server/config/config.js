var env = process.env.NODE_ENV || 'development';

// Only using config json file for dev or testing
if (env === 'development' || env === 'test') {
  var config = require('./config.json');
  var envConfig = config[env];
  // Grabbing the config var for just the current environment

// Loop through env config keys
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}

// * Added config.json to .gitignore by simply adding it to the file
// This file has our JWT_SECRET which we do not want in version control
