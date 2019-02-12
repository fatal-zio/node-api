require('should');

const request = require('supertest');
const mongoose = require('mongoose');

process.env.ENV = 'Test';

const app = require('../app.js');

const Book = mongoose.model('Book');
const agent = request.agent(app);

describe('Book CRUD Tests', () => {
  it('should allow a book to be posted and return read = false and an _id', done => {
    const bookPost = { title: 'My Book', author: 'Joe', genre: 'Fiction' };
    agent
      .post('/api/books')
      .send(bookPost)
      .expect(200)
      .end((err, result) => {
        result.body.read.should.equal(false);
        result.body.should.have.property('_id');
        done();
      });
  });

  afterEach(done => {
    Book.deleteMany({}).exec();
    done();
  });

  after(done => {
    mongoose.connection.close();
    app.server.close(done());
  });
});
