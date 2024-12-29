const { test, after, beforeEach } = require('node:test');

const assert = require('node:assert');
const Blog = require('../models/blog');
const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./tests_helper');

const app = require('../app');
const api = supertest(app);

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'Jonhy',
    url: 'www.jonhy.com',
    likes: 5
  },
  {
    title: 'Browser can execute only JavaScript',
    author: 'Carla',
    url: 'www.carla.com',
    likes: 11
  }
];

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

test.only('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test.only('there are two blogs', async () => {
  const response = await api.get('/api/blogs');

  assert.strictEqual(response.body.length, initialBlogs.length);
});

test.only('the first blog is about HTTP methods', async () => {
  const response = await api.get('/api/blogs');

  const titles = response.body.map((e) => e.title);
  // is the argument truthy
  assert(titles.includes('HTML is easy'));
});

test.only('blog posts contains id property', async () => {
  const aBlog = await helper.randomBlog();
  assert.ok(aBlog.id !== undefined, 'Blog post should have an id property');
});

test('successfully creates a new blog post', async () => {
  const newBlog = {
    url: 'https://github.com/Pablo-fp',
    likes: 1000,
    author: 'Pablo Fernandez',
    title: 'A curious´s architect Github'
  };

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect('Content-Type', /application\/json/);

  assert(
    response.status === 200 || response.status === 201,
    `Expected status 200 or 201, got ${response.status}`
  );

  const blogsAfterSaving = await helper.blogsInDb();
  assert.strictEqual(
    blogsAfterSaving.length,
    initialBlogs.length + 1,
    'Blog count should increase by 1'
  );

  const createdBlog = response.body;
  assert.strictEqual(
    createdBlog.title,
    newBlog.title,
    'Created blog should have the correct title'
  );
  assert.strictEqual(
    createdBlog.author,
    newBlog.author,
    'Created blog should have the correct author'
  );
  assert.strictEqual(
    createdBlog.url,
    newBlog.url,
    'Created blog should have the correct URL'
  );
  assert.strictEqual(
    createdBlog.likes,
    newBlog.likes,
    'Created blog should have the correct number of likes'
  );
});

after(async () => {
  await mongoose.connection.close();
});
