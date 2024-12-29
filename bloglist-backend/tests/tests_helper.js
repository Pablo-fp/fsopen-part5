const Blog = require('../models/blog');
const User = require('../models/user');

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const randomBlog = async () => {
  const blogs = await blogsInDb();
  return blogs[Math.floor(Math.random() * blogs.length)];
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = { blogsInDb, randomBlog, usersInDb };
