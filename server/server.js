// LIBRARY IMPORTS:
// Store the libaries in a variable
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb'); // ObjectID is mongo's unique identifier
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

// POST ROUTE: url and call back func
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

// GET all todos
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  })
});

// GET a todo by id
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

    res.send(todo);

  }).catch((e) => {
    res.status(400).send()
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});


// var oneMoreTodo = new Todo({
//   text: 'Code in Swift later today',
//   completed: false,
//   type: 10000000
// })

// This is responsible for actually saving it to the database
// oneMoreTodo.save().then((doc) => {
//   console.log(JSON.stringify(doc, undefined, 2));  // undefined is for filter, 2 is for indenting
// }, (e) => {
//   console.log('Unable to save Todo.', e);
// });


// var newUser = new User({
//   email: 'puff@gmail.com'
// });
//
// newUser.save().then((doc) => {
//   console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//   console.log('Cant save user', e);
// });
