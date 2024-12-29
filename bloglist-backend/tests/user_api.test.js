const { test, after, beforeEach } = require('node:test');

const bcrypt = require('bcrypt');
const User = require('../models/user');

const assert = require('node:assert');
const Blog = require('../models/blog');
const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./tests_helper');

const app = require('../app');
const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const user = new User({
    name: 'Superuser',
    username: 'root',
    passwordHash: await bcrypt.hash('sekret', 10)
  });

  await user.save();
});

test('creation succeeds with a fresh username', async () => {
  const usersAtStart = await helper.usersInDb();

  const newUser = {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    password: 'salainen'
  };

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const usersAtEnd = await helper.usersInDb();
  assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

  const usernames = usersAtEnd.map((u) => u.username);
  assert(usernames.includes(newUser.username));
});

after(async () => {
  await mongoose.connection.close();
});
