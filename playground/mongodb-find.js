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

  db.collection('Todos').find({completed: false}).toArray().then((docs) => {   // Fetch all objects, everything.
    // .find returns a cursur- points to the docs. Add a query here, i.e. ({completed: false})
    // Can query by ID:  .find({_id: new ObjectID('986faf9090asf0')})
    // .toArray  gets us what we want back, the documents. Also returns a promise, so we can tack on a .then call

console.log('Todos');
console.log(JSON.stringify(docs, undefined, 2));  // undefined for filter, 2 for indentation
}, (err) => {
  console.log('Unable to fetch todos', err);
});

db.collection('Todos').find().count().then((count) => {
  console.log(`Todos count: ${count}`);
}, (err) => {
  console.log('Unable to fetch todo count', err);
});

db.collection('Todos').find({text: 'Something to do'}).toArray().then((docs) => {
  console.log('Todos- search by something to do:');
  console.log(JSON.stringify(docs, undefined, 2));
}, (err) => {
  console.log('Unable to fetch todos', err);
});


  //client.close();
})
