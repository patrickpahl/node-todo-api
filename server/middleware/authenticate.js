// Import user
var {User} = require('./../models/user');

// Middleware function so that all our routes will be private and can use it
var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      // Simply reject if we can't find by token
      return Promise.reject();
    }

    req.user = user;
    req.token = token;
    // Need to call next or the code in the user/me func will never execute
    next();
  }).catch((e) => {
    // Send a 401 back if we can't find a user
    res.status(401).send();
  });
};

// Export set to authenticate var set above
module.exports = {authenticate};
