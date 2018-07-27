// MongoDB v3
// node playground/mongodb-connect.js   // Use to connect to db

const MongoClient = require('mongodb').MongoClient;
// Allows you to connect to the mongo server and issue commands to alter the db

//Object Destructuring: Lets you pull out properties from an object creating variables
var user = {name: 'Patrick', age: 99}
var {name} = user; // Destructured: pulled out the name, Patrick, and created a variable for it
console.log(name);
// *For the MongoClient, one could also: const{MongoClient} = require('mongodb');

// Using the /TodoApp db. No need to create the db in advance, just name it and use it.
MongoClient.connect('mongodb://localhost:3000/TodoApp', (err,client) => { ///*** Changed from 27017
  if (err) {
    return console.log('Unable to connect to MongoDB server'); // If unable to connect to db
  }
  console.log('Connected to MongoDB server');  // Success message when you connect to db
  const db = client.db('TodoApp') // DB reference for the todo

  db.collection('Todos').insertOne({  // Insert a record in the db.
    // collection takes one argument, the name of the db you want to insert in to.
    // First we provide the data, second we provide the callback function
    text: 'code a lot sunday',
    completed: true
  }, (err, result) => {
    if (err) {
      return console.log('Unable to insert todo', err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
    // result.ops shows data inserted
    // undefined is for filter function, and 2 is the indentation
  });

// db.collection('Users').insertOne({
//   name: 'Puff',
//   age: 99,
//   location: 'OKC'
// }, (err, result) => {
//   if (err) {
//     return console.log('Unable to insert todo...');
//   }
//   console.log(JSON.stringify(result.ops, undefined, 2));
// });

  client.close();
})
