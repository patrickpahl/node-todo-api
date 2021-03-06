require('./config/config.js');

// LIBRARY IMPORTS:
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb'); // ObjectID is mongo's unique identifier
// We're using ObjectID below to validate it below

// LOCAL IMPORTS:
// Pulling off the mongoose property, var {mongoose}, is ES6 destructuring.
var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js')
var {User} = require('./models/user.js')
var {authenticate} = require('./middleware/authenticate.js');

//* In package.json, add this under scripts. Tells heroku how to start app.
//"start": "node server/server.js",
//* Also tell heroku which version of node you're using here:
//"engines": {
//  "node": "9.2.1"
//},

// app stores our express application
var app = express();

const port = process.env.PORT;
// Port may or may not be set on heroku, otherwise use localhost 3000

app.use(bodyParser.json());
// Configure the middleware

// ***POST a todo
app.post('/todos', authenticate, (req, res) => {
  console.log(req.body); // request body, where the body is stored by body parser

  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });
  todo.save().then((doc) => {
    res.send(doc); // If the save is successful, send info back to the user, i.e. ID of todo
  }, (e) => {
    res.status(400).send(e);  // Send back 400 status to user
  });
});

// ***GET all todos     .get is built into express
app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id   // Query by user to only get his todos
  }).then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  })
});

// ***GET a todo by id
app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  // If ObjectID is NOT valid, we send the user back a 404
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

Todo.findOne({
  _id: id,
  _creator: req.user._id
}).then((todo) => {
  //Todo.findById(id).then((todo) => {  // Old way to just find any object with an ID

    if (!todo) {
      return res.status(404).send();
      // If there actually isn't a todo, we want to respond with a 404
    }
    // Line below is the success case
    res.send({todo});
    // {todo} is attached as the todo property. More flexibility to add custom status codes
  }).catch((e) => {         // Catch an error here if we don't find the todo id entered
    res.status(400).send();
  });
});

// ***DELETE a todo
app.delete('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  // If ObjectID is NOT valid, we send the user back a 404
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

Todo.findOneAndRemove({
  _id: id,
  _creator: req.user._id
}). then((todo) => {
  //Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});

  }).catch((e) => {
    res.status(400).send()
  });
});

// ***PATCH a todo (UPDATE)
app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  //pick is from lodash
  //pick takes an object and takes an array of properties you want to pull off, if exists
  // These are the only two properties the user can update, They can't update the todo id
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

// Here we're updating the completed property based on what it is now
//Checking if completed is a boolean and is completed
if (_.isBoolean(body.completed) && body.completed) {
// Set completed at to getTime(), a js timestamp. Just a regular number.
  body.completedAt = new Date().getTime();
} else {
  body.completed = false;
  body.completedAt = null;
}

// Set values on our object:
// Have to use mongodb operators like increment or set. Set takes key-value pairs
// Setting the body variable. 'new' means we get the new object back.
Todo.findOneAndUpdate({
  _id: id,
  _creator: req.user._id},
  {$set: body},
  {new: true}).then((todo) => {
//Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {   // Old way to find an id and update
  if (!todo) {
    return res.status(404).send();
  }

res.send({todo});
}).catch((e) => {
  res.status(400).send();
})
});

// *** POST /users
app.post('/users', (req, res) => {
  //pick is from lodash
  //First argument is the object we want to pick from, Second argument is an array of things we will pick from
  var body = _.pick(req.body, ['email', 'password']);
  //Pass in the object we need (body) to create the new user
  var user = new User(body);

  //Call to save to the database: success/fail case after
  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    // 'x-auth' is a custom header bc we're using a jwt token scheme
    // 2nd argument is the token
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

/// *** Gets logged in user by token
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

///*** POST /users/login {email, password}, getting a token
app.post('/users/login', (req, res) => {
var body = _.pick(req.body, ['email', 'password']);

User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
    //res.send(user); // Only sent user back for postman example
  }).catch((e) => {
    res.status(400).send();
  });
});

/// *** DELETE /users/me/token
app.delete('/users/me/token', authenticate, (req, res) => {
  // Route, calling authenticate middleware, and then our callback
  req.user.removeToken(req.token).then(() => {
    // Using removeToken method from user. Don't need anything back from .then, just send the status code back
    res.status(200).send();
  }), () => {
    res.status(400).send()
  };
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
