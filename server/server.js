// LIBRARY IMPORTS:
// Store the libaries in a variable
var express = require('express');
var bodyParser = require('body-parser');


// LOCAL IMPORTS:
// Pulling off the mongoose property, var {mongoose}, is ES6 destructuring.
var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js')
var {User} = require('./models/user.js')

// app stores our express application
var app = express();

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

app.listen(3000, () => {
  console.log('Started on port 3000');
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
