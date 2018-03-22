// MongoDB v3
// node playground/mongodb-connect.js   // Use to connect to db
const MongoClient = require('mongodb').MongoClient;
const ObjectID = MongoClient.ObjectID;
// Allows you to connect to the mongo server and issue commands to alter the db

// Using the /TodoApp db. No need to create the db in advance, just name it and use it.
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server'); // If unable to connect to db
  }
  console.log('Connected to MongoDB server');  // Success message when you connect to db
const db = client.db('TodoApp')

// Delete many
// db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
//   console.log(result);
// });

// Delete one
// db.collection('Todos').deleteOne({text: 'Pay bills'}).then((result) => {
//   console.log(result);
// });

// Find one and delete it. In terminal it will show you the value and then delete it.
db.collection('Todos').findOneAndDelete({text: 'Buy tires'}).then((result) => {
  console.log(result);
});

  //client.close();
})
