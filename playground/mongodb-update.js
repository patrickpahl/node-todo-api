// MongoDB v3
// node playground/mongodb-connect.js   // Use to connect to db
//const MongoClient = require('mongodb').MongoClient;
//const ObjectID = MongoClient.ObjectID;
const {MongoClient, ObjectID} =  require('mongodb');
// Destructuring: Instead of the comments above we'll use Destructuring
// Pull off any properties from the mongodb client. Also pulling off the ObjectID property


// Using the /TodoApp db. No need to create the db in advance, just name it and use it.
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server'); // If unable to connect to db
  }
  console.log('Connected to MongoDB server');  // Success message when you connect to db
const db = client.db('TodoApp')

db.collection('Todos').findOneAndUpdate({
  _id : new ObjectID('5ab080a2622157033add04cb')
}, {
  $set: {
    // Find set in the mongodb update operators docs
    completed: false
  }
}, {
  returnOriginal: false
  // We don't want the original object. We want the one we updated.
}).then((result) => {
  console.log(result);
});

  //client.close();
});
