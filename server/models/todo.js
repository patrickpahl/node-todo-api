//We don't have to load in the mongoose js file we created, just the library here:
var mongoose = require('mongoose');

//Create model for everything we want to store.
// First is the name of the model, Second we define the object
var Todo = mongoose.model('Todo', {
text: {
  type: String,
  required: true,    // Set up validators
  minLength: 1,
  trim: true         // trims whitespace
},
completed: {
  type: Boolean,
  default: false    // todo can't be true when you create it.
},
completedAt: {
  // Unix timestamp, which is a Number
  type: Number,
  default: null   // Bc the new todo isn't complete, it won't have a completed date
},
// Use _ to let whoever know it is an object ID
_creator: {
  type: mongoose.Schema.Types.ObjectId, // To get to the ObjectId, we go through mongoose
  required: true,
}
});

// Export the model so we can use it in files that require it
module.exports = {
  Todo: Todo
};
