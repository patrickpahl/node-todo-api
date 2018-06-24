// Mocha does not need to be required, its not how it's used

const expect = require('expect');
const request = require('supertest');

//Load in the server and the todo models
const {app} = require('./../server.js');  // Use relative path, then go back one
const {Todo} = require('./../models/todo');

// Runs before each test case, deletes everything.
beforeEach((done) => {
  Todo.remove({}).then(() => done());
});

// POST Test
describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);  // return stops anything below from running
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

it('should not create todo with invalid body data', (done) => {
  request(app)
  .post('/todos')
  .send({})
  .expect(400)
  .end((err, res) => {
    if (err) {
      return done(err);
    }
    Todo.find().then((todos) => {
      expect(todos.length).toBe(0);
    }).catch((e) => done(e));
  });
});

});

// *In package.json we have the test run under scripts
// In terminal, run 'npm run test'
