const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    console.log('Transforming document:', returnedObject);

    if (returnedObject._id) {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
    }
    delete returnedObject.__v;

    // Prevent circular reference
    if (returnedObject.user) {
      returnedObject.user = {
        id: returnedObject.user.id,
        username: returnedObject.user.username,
        name: returnedObject.user.name
      };
    }
  }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
