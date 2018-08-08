// LIBRARY IMPORTS:
// Store the libaries in a const
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

//** In package.json, add this under scripts. Tells heroku how to start app.
//"start": "node server/server.js",
//** Also tell heroku which version of node you're using here:
//"engines": {
//  "node": "9.2.1"
//},

// app stores our express application
var app = express();

const port = process.env.PORT || 3000;
// Port may or may not be set on heroku, otherwise use localhost 3000

app.use(bodyParser.json());
// Configure the middleware

// ***POST a todo
app.post('/todos', (req, res) => {
  console.log(req.body); // request body, where the body is stored by body parser

  var todo = new Todo({
    text: req.body.text
  });
  todo.save().then((doc) => {
    res.send(doc); // If the save is successful, send info back to the user, i.e. ID of todo
  }, (e) => {
    res.status(400).send(e);  // Send back 400 status to user
  });
});

// ***GET all todos
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  })
});

// ***GET a todo by id
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  // If ObjectID is NOT valid, we send the user back a 404
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    // If there actually isn't a todo, we want to respond with a 404
    if (!todo) {
      return res.status(404).send();
    }
    // Line below is the success case
    res.send({todo});
    // {todo} is attached as the todo property. More flexibility to add custom status codes
  }).catch((e) => {         // Catch an error here if we don't find the todo id entered
    res.status(400).send();
  });
});

// ***DELETE a todo
app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  // If ObjectID is NOT valid, we send the user back a 404
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {

    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});

  }).catch((e) => {
    res.status(400).send()
  });
});

// ***PATCH a todo (UPDATE)
app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
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

// Have to use mongodb operators like increment or set. Set takes key-value pairs
Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
  if (!todo) {
    return res.status(404).send();
  }

res.send({todo});
}).catch((e) => {
  res.status(400).send();
})
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

// var newUser = new User({
//   email: 'puff@gmail.com'
// });
//
// newUser.save().then((doc) => {
//   console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//   console.log('Cant save user', e);
// });
